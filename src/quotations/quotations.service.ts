import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildPageMeta } from '../common/pagination.util';
import { CreateQuotationWithClientDto, QuotationItemDto, UpdateQuotationDto } from './dto';

const QUOTATION_INCLUDE = {
  customer: true,
  project: true,
  items: { orderBy: { sortOrder: 'asc' } },
} satisfies Prisma.QuotationInclude;

function finalRate(rate: number, discountPct = 0, profitPct = 0): number {
  return rate * (1 - discountPct / 100) * (1 + profitPct / 100);
}

function lineAmount(item: { rate: number; quantity: number; discountPct?: number; profitPct?: number }): number {
  return finalRate(item.rate, item.discountPct, item.profitPct) * item.quantity;
}

@Injectable()
export class QuotationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: { page?: number; limit?: number }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 5000) : 10;

    const [items, totalItems] = await Promise.all([
      this.prisma.quotation.findMany({
        include: QUOTATION_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.quotation.count(),
    ]);

    return { items, meta: buildPageMeta(totalItems, page, limit) };
  }

  async get(id: string) {
    return this.prisma.quotation.findUnique({ where: { id }, include: QUOTATION_INCLUDE });
  }

  async createWithClient(dto: CreateQuotationWithClientDto) {
    const quotationCode = await this.nextCode('quotation_code_seq', 'QUO');
    const projectCode = await this.nextCode('project_code_seq', 'PRJ');

    return this.prisma.quotation.create({
      data: {
        code: quotationCode,
        status: 'DRAFT',
        customer: {
          create: {
            name: dto.clientName,
            phone: dto.clientPhone ?? null,
            address: dto.clientAddress ?? null,
          },
        },
        project: {
          create: {
            code: projectCode,
            name: dto.projectName,
            startDate: dto.startDate ? new Date(dto.startDate) : null,
            endDate: dto.endDate ? new Date(dto.endDate) : null,
          },
        },
      },
      include: QUOTATION_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateQuotationDto) {
    const existing = await this.prisma.quotation.findUnique({ where: { id }, include: QUOTATION_INCLUDE });
    if (!existing) throw new NotFoundException('Quotation not found');

    return this.prisma.$transaction(async (tx) => {
      if (dto.items) {
        await tx.quotationItem.deleteMany({ where: { quotationId: id } });
        await tx.quotationItem.createMany({
          data: (dto.items as QuotationItemDto[]).map((it, i) => ({
            quotationId: id,
            description: it.description,
            unit: it.unit,
            quantity: it.quantity,
            rate: it.rate,
            discountPct: it.discountPct ?? 0,
            profitPct: it.profitPct ?? 0,
            taxRate: it.taxRate ?? 0,
            amount: lineAmount(it),
            sortOrder: i,
          })),
        });
      }

      await tx.quotation.update({
        where: { id },
        data: {
          validTill: dto.validTill !== undefined ? new Date(dto.validTill) : undefined,
          termsAndConditions: dto.termsAndConditions !== undefined ? dto.termsAndConditions : undefined,
          sheetData: dto.sheetData !== undefined ? (dto.sheetData as Prisma.InputJsonValue) : undefined,
          activityRows: dto.activityRows !== undefined ? (dto.activityRows as Prisma.InputJsonValue) : undefined,
          activityCustomizations:
            dto.activityCustomizations !== undefined
              ? (dto.activityCustomizations as Prisma.InputJsonValue)
              : undefined,
          brandPreferences:
            dto.brandPreferences !== undefined ? (dto.brandPreferences as Prisma.InputJsonValue) : undefined,
        },
      });

      if (dto.customer) {
        await tx.quotationCustomer.update({
          where: { quotationId: id },
          data: {
            name: dto.customer.name !== undefined ? dto.customer.name : undefined,
            phone: dto.customer.phone !== undefined ? dto.customer.phone : undefined,
            address: dto.customer.address !== undefined ? dto.customer.address : undefined,
          },
        });
      }

      if (dto.project) {
        await tx.quotationProject.update({
          where: { quotationId: id },
          data: {
            name: dto.project.name !== undefined ? dto.project.name : undefined,
            startDate: dto.project.startDate !== undefined ? new Date(dto.project.startDate) : undefined,
            endDate: dto.project.endDate !== undefined ? new Date(dto.project.endDate) : undefined,
          },
        });
      }

      return this.recompute(tx, id);
    });
  }

  async updateStatus(id: string, status: string) {
    const existing = await this.prisma.quotation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Quotation not found');
    return this.prisma.quotation.update({
      where: { id },
      data: { status: status as never },
      include: QUOTATION_INCLUDE,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.quotation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Quotation not found');
    await this.prisma.quotation.delete({ where: { id } });
  }

  async addItem(quotationId: string, dto: QuotationItemDto) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { items: true },
    });
    if (!quotation) throw new NotFoundException('Quotation not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.quotationItem.create({
        data: {
          quotationId,
          description: dto.description,
          unit: dto.unit,
          quantity: dto.quantity,
          rate: dto.rate,
          discountPct: dto.discountPct ?? 0,
          profitPct: dto.profitPct ?? 0,
          taxRate: dto.taxRate ?? 0,
          amount: lineAmount(dto),
          sortOrder: quotation.items.length,
        },
      });
      return this.recompute(tx, quotationId);
    });
  }

  async updateItem(quotationId: string, itemId: string, dto: Partial<QuotationItemDto>) {
    const item = await this.prisma.quotationItem.findUnique({ where: { id: itemId } });
    if (!item || item.quotationId !== quotationId) throw new NotFoundException('Item not found');

    return this.prisma.$transaction(async (tx) => {
      const merged = {
        rate: dto.rate ?? Number(item.rate),
        quantity: dto.quantity ?? Number(item.quantity),
        discountPct: dto.discountPct ?? Number(item.discountPct),
        profitPct: dto.profitPct ?? Number(item.profitPct),
      };
      await tx.quotationItem.update({
        where: { id: itemId },
        data: {
          description: dto.description ?? undefined,
          unit: dto.unit ?? undefined,
          quantity: dto.quantity ?? undefined,
          rate: dto.rate ?? undefined,
          discountPct: dto.discountPct ?? undefined,
          profitPct: dto.profitPct ?? undefined,
          taxRate: dto.taxRate ?? undefined,
          amount: lineAmount(merged),
        },
      });
      return this.recompute(tx, quotationId);
    });
  }

  async removeItem(quotationId: string, itemId: string) {
    const item = await this.prisma.quotationItem.findUnique({ where: { id: itemId } });
    if (!item || item.quotationId !== quotationId) throw new NotFoundException('Item not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.quotationItem.delete({ where: { id: itemId } });
      return this.recompute(tx, quotationId);
    });
  }

  private async recompute(tx: Prisma.TransactionClient, quotationId: string) {
    const items = await tx.quotationItem.findMany({ where: { quotationId } });
    let subTotal = 0;
    let taxTotal = 0;
    for (const it of items) {
      const amt = Number(it.amount);
      subTotal += amt;
      taxTotal += amt * (Number(it.taxRate) / 100);
    }
    const grandTotal = subTotal + taxTotal;

    return tx.quotation.update({
      where: { id: quotationId },
      data: {
        subTotal: Number(subTotal.toFixed(2)),
        taxTotal: Number(taxTotal.toFixed(2)),
        grandTotal: Number(grandTotal.toFixed(2)),
      },
      include: QUOTATION_INCLUDE,
    });
  }

  private async nextCode(sequenceName: string, prefix: string): Promise<string> {
    const rows = await this.prisma.$queryRawUnsafe<{ nextval: bigint }[]>(
      `SELECT nextval('${sequenceName}')`,
    );
    const seq = rows[0].nextval.toString().padStart(6, '0');
    return `${prefix}-${seq}`;
  }
}
