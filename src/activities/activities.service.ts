import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildPageMeta } from '../common/pagination.util';
import { CreateActivityDto, UpdateActivityDto } from './dto';

export interface ListActivitiesParams {
  page?: number;
  limit?: number;
  search?: string;
  wiringType?: string;
  segment?: string;
}

const ACTIVITY_INCLUDE = {
  requirements: { include: { category: true } },
} satisfies Prisma.ActivityInclude;

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: ListActivitiesParams) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 5000) : 20;

    const where: Prisma.ActivityWhereInput = {};
    if (params.wiringType) where.wiringType = params.wiringType as never;
    if (params.segment) where.segment = params.segment as never;
    if (params.search) {
      const q = params.search.trim();
      if (q) {
        where.OR = [
          { name: { contains: q, mode: 'insensitive' } },
          { code: { contains: q, mode: 'insensitive' } },
        ];
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
    return this.prisma.activity.findUnique({ where: { id }, include: ACTIVITY_INCLUDE });
  }

  async create(dto: CreateActivityDto) {
    const code = await this.nextCode();
    return this.prisma.activity.create({
      data: {
        code,
        name: dto.name,
        wiringType: dto.wiringType as never,
        segment: (dto.segment ?? null) as never,
        unit: (dto.unit ?? (dto.wiringType === 'POINT_WIRING' ? 'POINT' : 'CIRCUIT')) as never,
        description: dto.description ?? null,
        sheetData: (dto.sheetData ?? null) as Prisma.InputJsonValue,
        materialCost: dto.materialCost ?? null,
        labourCost: dto.labourCost ?? null,
        requirements: {
          create: dto.requirements.map((r, i) => ({
            categoryId: r.categoryId,
            description: r.description,
            unit: r.unit as never,
            quantity: r.quantity,
            sortOrder: r.sortOrder ?? i,
          })),
        },
      },
      include: ACTIVITY_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateActivityDto) {
    const existing = await this.prisma.activity.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Activity not found');

    return this.prisma.$transaction(async (tx) => {
      if (dto.requirements) {
        await tx.activityRequirement.deleteMany({ where: { activityId: id } });
        await tx.activityRequirement.createMany({
          data: dto.requirements.map((r, i) => ({
            activityId: id,
            categoryId: r.categoryId,
            description: r.description,
            unit: r.unit as never,
            quantity: r.quantity,
            sortOrder: r.sortOrder ?? i,
          })),
        });
      }

      const updated = await tx.activity.update({
        where: { id },
        data: {
          name: dto.name ?? undefined,
          wiringType: (dto.wiringType as never) ?? undefined,
          segment: dto.segment !== undefined ? (dto.segment as never) : undefined,
          unit: (dto.unit as never) ?? undefined,
          description: dto.description !== undefined ? dto.description : undefined,
          sheetData: dto.sheetData !== undefined ? (dto.sheetData as Prisma.InputJsonValue) : undefined,
          materialCost: dto.materialCost !== undefined ? dto.materialCost : undefined,
          labourCost: dto.labourCost !== undefined ? dto.labourCost : undefined,
        },
        include: ACTIVITY_INCLUDE,
      });

      return updated;
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.activity.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Activity not found');
    await this.prisma.activity.delete({ where: { id } });
  }

  async duplicate(id: string, name: string) {
    const source = await this.prisma.activity.findUnique({ where: { id }, include: ACTIVITY_INCLUDE });
    if (!source) throw new NotFoundException('Activity not found');

    const code = await this.nextCode();
    return this.prisma.activity.create({
      data: {
        code,
        name,
        wiringType: source.wiringType,
        segment: source.segment,
        unit: source.unit,
        description: source.description,
        sheetData: source.sheetData as Prisma.InputJsonValue,
        materialCost: source.materialCost,
        labourCost: source.labourCost,
        requirements: {
          create: source.requirements.map((r) => ({
            categoryId: r.categoryId,
            description: r.description,
            unit: r.unit,
            quantity: r.quantity,
            sortOrder: r.sortOrder,
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
