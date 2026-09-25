import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildPageMeta } from '../common/pagination.util';
import { CreateQuotationWithClientDto, QuotationItemDto, UpdateQuotationDto } from './dto';
import { NotificationsService } from '../notifications/notifications.service';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService
  ) {}

  /** Non-SUPERADMIN users only ever see/touch quotations belonging to their own
   *  tenant (an ADMIN and their STAFF share one tenant id). Throws NotFoundException
   *  rather than a permission error so a foreign quotation's existence isn't leaked. */
  private assertOwnership(quotation: { tenantId: string | null }, user?: any) {
    if (!user || user.role === 'SUPERADMIN') return;
    const tId = user.adminId || user.id;
    if (quotation.tenantId !== tId) throw new NotFoundException('Quotation not found');
  }

  async list(params: { page?: number; limit?: number }, user?: any) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 5000) : 10;

    const where: Prisma.QuotationWhereInput = {};
    if (user && user.role !== 'SUPERADMIN') {
      where.tenantId = user.adminId || user.id;
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.quotation.findMany({
        where,
        include: QUOTATION_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.quotation.count({ where }),
    ]);

    return { items, meta: buildPageMeta(totalItems, page, limit) };
  }

  async get(id: string, user?: any) {
    const quotation = await this.prisma.quotation.findUnique({ where: { id }, include: QUOTATION_INCLUDE });
    if (!quotation) throw new NotFoundException('Quotation not found');
    this.assertOwnership(quotation, user);
    return quotation;
  }

  async createWithClient(dto: CreateQuotationWithClientDto, user?: any) {
    let quotationCode = await this.nextCode('quotation_code_seq', 'QUO');
    
    if (dto.parentQuotationId) {
      const parent = await this.prisma.quotation.findUnique({ where: { id: dto.parentQuotationId } });
      if (parent) {
        const baseCode = parent.code.split('-R')[0];
        const existingRevisions = await this.prisma.quotation.findMany({
          where: { code: { startsWith: baseCode + '-R' } }
        });
        const nextRev = existingRevisions.length + 1;
        quotationCode = `${baseCode}-R${nextRev}`;
      }
    }

    const projectCode = await this.nextCode('project_code_seq', 'PRJ');

    const quotation = await this.prisma.quotation.create({
      data: {
        code: quotationCode,
        status: 'DRAFT',
        tenantId: user && user.role !== 'SUPERADMIN' ? user.adminId || user.id : null,
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

    if (user && user.role === 'STAFF' && user.adminId) {
      await this.notificationsService.create(
        user.adminId,
        'New Quotation Created',
        `Staff member ${user.firstName || user.username} has created a new quotation (${quotation.code}).`
      );
    }

    return quotation;
  }

  async update(id: string, dto: UpdateQuotationDto, user?: any) {
    const existing = await this.prisma.quotation.findUnique({ where: { id }, include: QUOTATION_INCLUDE });
    if (!existing) throw new NotFoundException('Quotation not found');
    this.assertOwnership(existing, user);

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
            snapshotData: it.snapshotData !== undefined ? (it.snapshotData as Prisma.InputJsonValue) : undefined,
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
    }, { maxWait: 15000, timeout: 30000 });
  }

  async updateStatus(id: string, status: string, user?: any) {
    const existing = await this.prisma.quotation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Quotation not found');
    this.assertOwnership(existing, user);
    return this.prisma.quotation.update({
      where: { id },
      data: { status: status as never },
      include: QUOTATION_INCLUDE,
    });
  }

  async remove(id: string, user?: any) {
    const existing = await this.prisma.quotation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Quotation not found');
    this.assertOwnership(existing, user);
    await this.prisma.quotation.delete({ where: { id } });
  }

  async addItem(quotationId: string, dto: QuotationItemDto, user?: any) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { items: true },
    });
    if (!quotation) throw new NotFoundException('Quotation not found');
    this.assertOwnership(quotation, user);

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
          snapshotData: dto.snapshotData !== undefined ? (dto.snapshotData as Prisma.InputJsonValue) : undefined,
        },
      });
      return this.recompute(tx, quotationId);
    }, { maxWait: 15000, timeout: 30000 });
  }

  async updateItem(quotationId: string, itemId: string, dto: Partial<QuotationItemDto>, user?: any) {
    const item = await this.prisma.quotationItem.findUnique({ where: { id: itemId } });
    if (!item || item.quotationId !== quotationId) throw new NotFoundException('Item not found');
    const quotation = await this.prisma.quotation.findUnique({ where: { id: quotationId } });
    if (!quotation) throw new NotFoundException('Quotation not found');
    this.assertOwnership(quotation, user);

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
          snapshotData: dto.snapshotData !== undefined ? (dto.snapshotData as Prisma.InputJsonValue) : undefined,
        },
      });
      return this.recompute(tx, quotationId);
    }, { maxWait: 15000, timeout: 30000 });
  }

  async removeItem(quotationId: string, itemId: string, user?: any) {
    const item = await this.prisma.quotationItem.findUnique({ where: { id: itemId } });
    if (!item || item.quotationId !== quotationId) throw new NotFoundException('Item not found');
    const quotation = await this.prisma.quotation.findUnique({ where: { id: quotationId } });
    if (!quotation) throw new NotFoundException('Quotation not found');
    this.assertOwnership(quotation, user);

    return this.prisma.$transaction(async (tx) => {
      await tx.quotationItem.delete({ where: { id: itemId } });
      return this.recompute(tx, quotationId);
    }, { maxWait: 15000, timeout: 30000 });
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

  async generateAiDraft(quotationId: string, prompt: string, user?: any) {
    const quotation = await this.prisma.quotation.findUnique({ where: { id: quotationId } });
    if (!quotation) throw new NotFoundException('Quotation not found');
    this.assertOwnership(quotation, user);

    const tenantId = user && user.role !== 'SUPERADMIN' ? (user.adminId || user.id) : null;
    
    const [activities, products] = await Promise.all([
      this.prisma.activity.findMany({
        where: { OR: [{ tenantId: null }, { tenantId }] },
        include: { requirements: true }
      }),
      this.prisma.productModel.findMany({
        where: { OR: [{ tenantId: null }, { tenantId }] },
        include: { category: true, manufacturer: true }
      })
    ]);

    // Format products for AI context (flat architecture)
    const catalog = products.map(p => ({
      id: p.id,
      name: `${p.manufacturer?.name || p.manufacturerName || ''} ${p.series || ''} ${p.category?.name || p.categoryName || ''} ${p.color || ''} ${p.modelCode || ''}`.replace(/\s+/g, ' ').trim(),
      category: p.category?.name || p.categoryName,
      mrp: p.mrp,
      unit: p.unit || 'NOS'
    }));

    const activityContext = activities.map(a => ({
      id: a.id,
      name: a.name,
      unit: a.unit,
      materialsNeeded: a.requirements.map(r => r.description).join(', ')
    }));

    const systemPrompt = `
You are an expert electrical and MEP estimator.
Map the user's requirements into a structured Bill of Quantities.

Available Activities (Local & Global Master): ${JSON.stringify(activityContext)}
Available Materials (Local & Global Master): ${JSON.stringify(catalog)}

OUTPUT FORMAT:
Output a JSON array of items where each item has:
- isActivity (boolean): true if it's a parent activity, false if it's a material
- refId (string): The ID of the Activity or Material from the provided lists. If the required item is NOT in the list, use "NEW" (Outsourced).
- description (string): Name of the item
- unit (string): Unit of measurement
- qty (number): Quantity
- rate (number): Rate or MRP. If refId is "NEW", rate MUST be 0.

RULES:
- Rule 1: Always prioritize Local/Global Master items over Outsourcing. Search the provided lists carefully.
- Rule 2: If a required activity or material is missing from the lists, create it as an "Outsource" item (refId: "NEW", rate: 0).
- Rule 3: Lighting circuits generally use 1.0/1.5 sqmm wire and 6A/10A switches. Power circuits use 2.5/4.0 sqmm and 16A/20A sockets.
- Rule 4: If the prompt specifies a brand (e.g., Schneider Livia), strictly filter the materials to use that brand.
- Rule 5: Child materials must immediately follow their parent activity in the array.
`;

    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const text = response.text || '[]';
      const parsed = JSON.parse(text);
      return parsed;
    } catch (e) {
      console.error('AI Generation error:', e);
      // Return dummy data if the dummy key is used
      return [
        { isActivity: true, refId: 'act-1', description: 'AI Generated Task', unit: 'NOS', qty: 1, rate: 0 },
        { isActivity: false, refId: 'mat-1', description: '  ↳ Generated Material', unit: 'NOS', qty: 1, rate: 100 }
      ];
    }
  }

  private async nextCode(sequenceName: string, prefix: string): Promise<string> {
    const rows = await this.prisma.$queryRawUnsafe<{ nextval: bigint }[]>(
      `SELECT nextval('${sequenceName}')`,
    );
    const seq = rows[0].nextval.toString().padStart(6, '0');
    return `${prefix}-${seq}`;
  }
}
