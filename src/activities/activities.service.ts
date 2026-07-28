import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildPageMeta } from '../common/pagination.util';
import {
  ActivityChargeDto,
  ActivityRequirementOptionDto,
  CreateActivityDto,
  UpdateActivityDto,
} from './dto';

export interface ListActivitiesParams {
  page?: number;
  limit?: number;
  search?: string;
  wiringType?: string;
  segment?: string;
  scope?: 'global' | 'local' | 'all';
}

/** Builds the nested `options: { create: [...] }` clause for a requirement, or omits it
 *  entirely for the common "simple, single-make" case. If the caller didn't mark any option
 *  as default, the first one wins. */
function buildOptionsCreate(options: ActivityRequirementOptionDto[] | undefined) {
  if (!options || options.length === 0) return undefined;
  const hasDefault = options.some((o) => o.isDefault);
  return {
    create: options.map((o, i) => ({
      productId: o.productModelId,
      isDefault: hasDefault ? Boolean(o.isDefault) : i === 0,
      sortOrder: i,
    })),
  };
}

function buildChargesCreate(charges: ActivityChargeDto[] | undefined) {
  if (!charges || charges.length === 0) return undefined;
  return {
    create: charges.map((c, i) => ({
      description: c.description,
      amount: c.amount,
      sortOrder: c.sortOrder ?? i,
    })),
  };
}

const ACTIVITY_INCLUDE = {
  requirements: {
    include: {
      category: true,
      options: {
        orderBy: { sortOrder: 'asc' },
        include: {
          product: {
            include: {
              manufacturer: true,
            },
          },
        },
      },
    },
  },
  charges: {
    orderBy: { sortOrder: 'asc' },
  },
} satisfies Prisma.ActivityInclude;

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: ListActivitiesParams, user?: any) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 5000) : 20;

    const where: Prisma.ActivityWhereInput = {};
    if (params.wiringType) where.wiringType = params.wiringType as never;
    if (params.segment) where.segment = params.segment as never;
    if (user?.role === 'SUPERADMIN') {
      where.tenantId = null;
    } else if (user) {
      const tId = user.adminId || user.id;
      if (params.scope === 'global') {
        where.tenantId = null;
      } else if (params.scope === 'local') {
        where.tenantId = tId;
      } else {
        where.OR = [
          { tenantId: null },
          { tenantId: tId },
        ];
      }
    }

    if (params.search) {
      const q = params.search.trim();
      if (q) {
        if (!where.AND) where.AND = [];
        (where.AND as any[]).push({
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { code: { contains: q, mode: 'insensitive' } },
          ],
        });
      }
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        include: ACTIVITY_INCLUDE,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.activity.count({ where }),
    ]);

    return { items, meta: buildPageMeta(totalItems, page, limit) };
  }

  async get(id: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id }, include: ACTIVITY_INCLUDE });
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async create(dto: CreateActivityDto, user?: any) {
    const code = await this.nextCode();

    let tenantId = null;
    if (user && user.role !== 'SUPERADMIN') {
      tenantId = user.adminId || user.id;
    }

    return this.prisma.activity.create({
      data: {
        code,
        name: dto.name,
        wiringType: dto.wiringType as never,
        category: dto.category ?? null,
        segment: (dto.segment ?? null) as never,
        unit: (dto.unit || (dto.wiringType === 'POINT_WIRING' ? 'POINT' : 'CIRCUIT')) as never,
        description: dto.description ?? null,
        materialCost: dto.materialCost ?? null,
        labourCost: dto.labourCost ?? null,
        tenantId,
        requirements: {
          create: dto.requirements.map((r, i) => ({
            categoryId: r.categoryId,
            description: r.description,
            unit: (r.unit?.toUpperCase() || 'NOS') as never,
            quantity: r.quantity,
            discountPercent: r.discountPercent ?? undefined,
            taxPercent: r.taxPercent ?? undefined,
            sortOrder: r.sortOrder ?? i,
            options: buildOptionsCreate(r.options),
          })),
        },
        charges: buildChargesCreate(dto.charges),
      },
      include: ACTIVITY_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateActivityDto, user?: any) {
    const existing = await this.prisma.activity.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Activity not found');

    if (user && user.role !== 'SUPERADMIN' && existing.tenantId !== (user.adminId || user.id)) {
      throw new ConflictException('You cannot edit a global or foreign activity');
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.requirements) {
        await tx.activityRequirement.deleteMany({ where: { activityId: id } });
        for (const [i, r] of dto.requirements.entries()) {
          await tx.activityRequirement.create({
            data: {
              activityId: id,
              categoryId: r.categoryId,
              description: r.description,
              unit: (r.unit?.toUpperCase() || 'NOS') as never,
              quantity: r.quantity,
              discountPercent: r.discountPercent ?? undefined,
              taxPercent: r.taxPercent ?? undefined,
              sortOrder: r.sortOrder ?? i,
              options: buildOptionsCreate(r.options),
            },
          });
        }
      }

      if (dto.charges) {
        await tx.activityCharge.deleteMany({ where: { activityId: id } });
        for (const [i, c] of dto.charges.entries()) {
          await tx.activityCharge.create({
            data: {
              activityId: id,
              description: c.description,
              amount: c.amount,
              sortOrder: c.sortOrder ?? i,
            },
          });
        }
      }

      const updated = await tx.activity.update({
        where: { id },
        data: {
          name: dto.name ?? undefined,
          wiringType: (dto.wiringType as never) ?? undefined,
          category: dto.category !== undefined ? dto.category : undefined,
          segment: dto.segment !== undefined ? (dto.segment as never) : undefined,
          unit: (dto.unit as never) ?? undefined,
          description: dto.description !== undefined ? dto.description : undefined,
          materialCost: dto.materialCost !== undefined ? dto.materialCost : undefined,
          labourCost: dto.labourCost !== undefined ? dto.labourCost : undefined,
        },
        include: ACTIVITY_INCLUDE,
      });

      return updated;
    }, { maxWait: 10000, timeout: 60000 });
  }

  async remove(id: string, user?: any) {
    const existing = await this.prisma.activity.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Activity not found');

    if (user && user.role !== 'SUPERADMIN') {
      const tId = user.adminId || user.id;
      if (existing.tenantId !== tId) {
        throw new ConflictException('You cannot delete a global or foreign activity');
      }
    }

    await this.prisma.activity.delete({ where: { id } });
  }

  async removeAll() {
    await this.prisma.activity.deleteMany({});
  }

  async duplicate(id: string, newName: string, user?: any) {
    const source = await this.prisma.activity.findUnique({ where: { id }, include: ACTIVITY_INCLUDE });
    if (!source) throw new NotFoundException('Activity not found');

    const code = await this.nextCode();
    let tenantId = null;
    if (user && user.role !== 'SUPERADMIN') {
      tenantId = user.adminId || user.id;
    }

    return this.prisma.activity.create({
      data: {
        code,
        name: newName,
        wiringType: source.wiringType,
        category: source.category,
        segment: source.segment,
        unit: source.unit,
        description: source.description,
        materialCost: source.materialCost,
        labourCost: source.labourCost,
        tenantId,
        requirements: {
          create: source.requirements.map((r) => ({
            categoryId: r.categoryId,
            description: r.description,
            unit: r.unit,
            quantity: r.quantity,
            discountPercent: r.discountPercent,
            taxPercent: r.taxPercent,
            sortOrder: r.sortOrder,
            options:
              r.options.length > 0
                ? {
                    create: r.options.map((o) => ({
                      productId: o.productId,
                      isDefault: o.isDefault,
                      sortOrder: o.sortOrder,
                    })),
                  }
                : undefined,
          })),
        },
        charges: {
          create: source.charges.map((c) => ({
            description: c.description,
            amount: c.amount,
            sortOrder: c.sortOrder,
          })),
        },
      },
      include: ACTIVITY_INCLUDE,
    });
  }

  private async nextCode(): Promise<string> {
    const rows = await this.prisma.$queryRaw<{ nextval: bigint }[]>`SELECT nextval('activity_code_seq')`;
    const seq = rows[0].nextval.toString().padStart(6, '0');
    return `ACT-${seq}`;
  }
}
