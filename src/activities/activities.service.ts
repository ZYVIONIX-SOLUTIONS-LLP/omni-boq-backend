import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildPageMeta } from '../common/pagination.util';
import {
  ActivityChargeDto,
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
      subCategory: true,
    },
  },
  charges: {
    orderBy: { sortOrder: 'asc' },
  },
} satisfies Prisma.ActivityInclude;

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Types and Categories ─────────────────────────────────────────────────

  async getTypes(user?: any) {
    const where: Prisma.ActivityTypeWhereInput = {};
    if (user?.role === 'SUPERADMIN') {
      where.tenantId = null;
    } else if (user) {
      const tId = user.adminId || user.id;
      where.OR = [
        { tenantId: null },
        { tenantId: tId },
      ];
    }
    return this.prisma.activityType.findMany({
      where,
      include: {
        categories: {
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createType(name: string, user?: any) {
    let tenantId = null;
    if (user && user.role !== 'SUPERADMIN') {
      tenantId = user.adminId || user.id;
    }
    const nameNormalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.prisma.activityType.create({
      data: {
        name,
        nameNormalized,
        tenantId,
      },
    });
  }

  async removeType(id: string, user?: any) {
    const existing = await this.prisma.activityType.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Type not found');
    if (user && user.role !== 'SUPERADMIN') {
      if (existing.tenantId !== (user.adminId || user.id)) {
        throw new ConflictException('You cannot delete a global or foreign type');
      }
    }
    
    const inUse = await this.prisma.activity.findFirst({ where: { wiringType: existing.name }});
    if (inUse) throw new ConflictException(`Cannot delete: Type is used by activity ${inUse.code}`);
    
    await this.prisma.activityType.delete({ where: { id } });
  }

  async createCategory(typeId: string, name: string, user?: any) {
    const type = await this.prisma.activityType.findUnique({ where: { id: typeId } });
    if (!type) throw new NotFoundException('Type not found');
    
    let tenantId = null;
    if (user && user.role !== 'SUPERADMIN') {
      tenantId = user.adminId || user.id;
    }
    
    const nameNormalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.prisma.activityCategory.create({
      data: {
        name,
        nameNormalized,
        tenantId,
        typeId,
      },
    });
  }

  async removeCategory(id: string, user?: any) {
    const existing = await this.prisma.activityCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');
    if (user && user.role !== 'SUPERADMIN') {
      if (existing.tenantId !== (user.adminId || user.id)) {
        throw new ConflictException('You cannot delete a global or foreign category');
      }
    }
    
    const inUse = await this.prisma.activity.findFirst({ where: { category: existing.name }});
    if (inUse) throw new ConflictException(`Cannot delete: Category is used by activity ${inUse.code}`);
    
    await this.prisma.activityCategory.delete({ where: { id } });
  }

  // ── Activities ───────────────────────────────────────────────────────────

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
        labourCost: dto.labourCost ?? null,
        tenantId,
        requirements: {
          create: dto.requirements.map((r, i) => ({
            categoryId: r.categoryId,
            subCategoryId: r.subCategoryId ?? null,
            description: r.description,
            unit: (r.unit?.toUpperCase() || 'NOS') as never,
            quantity: r.quantity,
            requiredAttributes: r.requiredAttributes ?? {},
            sortOrder: r.sortOrder ?? i,
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
              subCategoryId: r.subCategoryId ?? null,
              description: r.description,
              unit: (r.unit?.toUpperCase() || 'NOS') as never,
              quantity: r.quantity,
              requiredAttributes: r.requiredAttributes ?? {},
              sortOrder: r.sortOrder ?? i,
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
          category: dto.category ?? undefined,
          segment: (dto.segment as never) ?? undefined,
          unit: (dto.unit as never) ?? undefined,
          description: dto.description ?? undefined,
          labourCost: dto.labourCost ?? undefined,
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
        labourCost: source.labourCost,
        tenantId,
        requirements: {
          create: source.requirements.map((r) => ({
            categoryId: r.categoryId,
            subCategoryId: r.subCategoryId,
            requiredAttributes: r.requiredAttributes ?? undefined,
            description: r.description,
            unit: r.unit,
            quantity: r.quantity,
            sortOrder: r.sortOrder,
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
