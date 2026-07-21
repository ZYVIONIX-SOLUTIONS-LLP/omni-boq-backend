import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPageMeta, normalizeName } from '../../common/pagination.util';
import { SaveProductDto } from './dto';

export interface ListProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  manufacturerId?: string;
  categoryId?: string;
  seriesId?: string;
}

const PRODUCT_INCLUDE = {
  manufacturer: true,
  division: true,
  series: true,
  category: true,
  subCategory: true,
  unit: true,
  variants: true,
} satisfies Prisma.ProductModelInclude;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async listProducts(params: ListProductsParams) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 5000) : 20;

    const where: Prisma.ProductModelWhereInput = {};
    if (params.manufacturerId) where.manufacturerId = params.manufacturerId;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.seriesId) where.seriesId = params.seriesId;

    if (params.search) {
      const q = params.search.trim();
      if (q) {
        where.OR = [
          { nameNormalized: { contains: q.toLowerCase() } },
          { manufacturer: { nameNormalized: { contains: q.toLowerCase() } } },
          { series: { nameNormalized: { contains: q.toLowerCase() } } },
          { category: { nameNormalized: { contains: q.toLowerCase() } } },
          {
            variants: {
              some: {
                OR: [
                  { name: { contains: q, mode: 'insensitive' } },
                  { modelCode: { contains: q, mode: 'insensitive' } },
                  { manufacturerSku: { contains: q, mode: 'insensitive' } },
                  { internalSku: { contains: q, mode: 'insensitive' } },
                  { barcode: { contains: q, mode: 'insensitive' } },
                ],
              },
            },
          },
        ];
      }
    }

    const [products, totalItems] = await Promise.all([
      this.prisma.productModel.findMany({
        where,
        include: PRODUCT_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.productModel.count({ where }),
    ]);

    const items = products.map((p) => this.toListRow(p));
    return { items, meta: buildPageMeta(totalItems, page, limit) };
  }

  async getProduct(id: string) {
    const product = await this.prisma.productModel.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });
    if (!product) return null;
    return {
      ...product,
      variants: [...product.variants].sort((a, b) => a.name.localeCompare(b.name)),
    };
  }

  async saveProduct(dto: SaveProductDto, id?: string) {
    const name = dto.name.trim();
    if (!name) throw new ConflictException('Product name is required');
    if (!dto.variants || dto.variants.length === 0) {
      throw new ConflictException('At least one variant is required');
    }

    const dup = await this.prisma.productModel.findFirst({
      where: {
        manufacturerId: dto.manufacturerId,
        seriesId: dto.seriesId ?? null,
        nameNormalized: normalizeName(name),
        ...(id ? { id: { not: id } } : {}),
      },
    });
    if (dup) throw new ConflictException(`"${name}" already exists for this manufacturer/series`);

    const productData: Prisma.ProductModelUncheckedUpdateInput = {
      name,
      nameNormalized: normalizeName(name),
      description: dto.description ?? null,
      manufacturerId: dto.manufacturerId,
      divisionId: dto.divisionId ?? null,
      seriesId: dto.seriesId ?? null,
      categoryId: dto.categoryId,
      subCategoryId: dto.subCategoryId ?? null,
      attributes: (dto.attributes ?? {}) as Prisma.InputJsonValue,
      unitId: dto.unitId ?? null,
      hsnCode: dto.hsnCode ?? null,
      gstRate: dto.gstRate ?? null,
      images: (dto.images ?? { gallery: [] }) as Prisma.InputJsonValue,
      status: dto.status ?? 'ACTIVE',
    };

    const productId = await this.prisma.$transaction(async (tx) => {
      const product = id
        ? await tx.productModel.update({ where: { id }, data: productData })
        : await tx.productModel.create({ data: productData as Prisma.ProductModelCreateInput });

      const existingVariants = id ? await tx.variant.findMany({ where: { productId: product.id } }) : [];
      const incomingIds = new Set(dto.variants.filter((v) => v.id).map((v) => v.id));
      const toDelete = existingVariants.filter((v) => !incomingIds.has(v.id));
      if (toDelete.length > 0) {
        await tx.variant.deleteMany({ where: { id: { in: toDelete.map((v) => v.id) } } });
      }

      for (const v of dto.variants) {
        const variantData = {
          name: v.name,
          modelCode: v.modelCode ?? null,
          manufacturerSku: v.manufacturerSku ?? null,
          internalSku: v.internalSku ?? null,
          barcode: v.barcode ?? null,
          ean: v.ean ?? null,
          attributes: (v.attributes ?? {}) as Prisma.InputJsonValue,
          priceMrp: v.prices?.mrp ?? null,
          priceDealer: v.prices?.dealer ?? null,
          priceDistributor: v.prices?.distributor ?? null,
          priceContractor: v.prices?.contractor ?? null,
          pricePurchase: v.prices?.purchase ?? null,
          priceOffer: v.prices?.offer ?? null,
          gstRate: v.gstRate ?? null,
          discountPercent: v.discountPercent ?? null,
          stockQty: v.stockQty ?? null,
          status: v.status ?? 'ACTIVE',
          image: (v.image ?? null) as Prisma.InputJsonValue,
        };

        if (v.id) {
          await tx.variant.update({ where: { id: v.id }, data: variantData });
        } else {
          await tx.variant.create({ data: { ...variantData, productId: product.id } });
        }
      }

      return product.id;
    });

    return this.getProduct(productId);
  }

  async deleteProduct(id: string) {
    const existing = await this.prisma.productModel.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');
    await this.prisma.productModel.delete({ where: { id } });
  }

  async exportProductRows(params: Omit<ListProductsParams, 'page' | 'limit'>) {
    const { items } = await this.listProducts({ ...params, page: 1, limit: 5000 });
    const rows: Array<Record<string, unknown>> = [];

    for (const p of items) {
      const specifications = await this.formatSpecifications(p.categoryId, p.attributes as Record<string, unknown>);
      const base = {
        productName: p.name,
        manufacturer: p.manufacturer?.name ?? '',
        series: p.series?.name ?? '',
        category: p.category?.name ?? '',
        subCategory: p.subCategory?.name ?? '',
        unit: p.unit?.name ?? '',
        hsnCode: p.hsnCode ?? '',
        specifications,
      };

      if (p.variantSummaries.length === 0) {
        rows.push({
          ...base,
          modelCode: '',
          variantName: '',
          gstRate: null,
          mrp: null,
          dealer: null,
          distributor: null,
          contractor: null,
          purchase: null,
          status: p.status,
        });
        continue;
      }

      for (const v of p.variantSummaries) {
        rows.push({
          ...base,
          modelCode: v.modelCode ?? '',
          variantName: v.name,
          gstRate: v.gstRate,
          mrp: v.mrp,
          dealer: v.dealer,
          distributor: v.distributor,
          contractor: v.contractor,
          purchase: v.purchase,
          status: v.status,
        });
      }
    }

    return rows;
  }

  async formatSpecifications(categoryId: string, attributes: Record<string, unknown>): Promise<string> {
    const defs = await this.prisma.attributeDef.findMany({ where: { categoryId } });
    const parts: string[] = [];
    for (const def of defs) {
      const value = attributes?.[def.id];
      if (value === null || value === undefined || value === '') continue;
      parts.push(`${def.name}: ${value}`);
    }
    return parts.join('; ');
  }

  private toListRow(product: Prisma.ProductModelGetPayload<{ include: typeof PRODUCT_INCLUDE }>) {
    const variantSummaries = product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      modelCode: v.modelCode,
      mrp: v.priceMrp ? Number(v.priceMrp) : null,
      dealer: v.priceDealer ? Number(v.priceDealer) : null,
      distributor: v.priceDistributor ? Number(v.priceDistributor) : null,
      contractor: v.priceContractor ? Number(v.priceContractor) : null,
      purchase: v.pricePurchase ? Number(v.pricePurchase) : null,
      gstRate: v.gstRate ? Number(v.gstRate) : null,
      status: v.status,
    }));
    const mrps = variantSummaries.map((v) => v.mrp).filter((n): n is number => n !== null);

    return {
      ...product,
      variants: undefined,
      variantSummaries,
      variantCount: variantSummaries.length,
      minMrp: mrps.length ? Math.min(...mrps) : null,
      maxMrp: mrps.length ? Math.max(...mrps) : null,
    };
  }
}
