import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPageMeta } from '../../common/pagination.util';
import { SaveProductDto } from './dto';

export interface ListProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  manufacturerId?: string;
  categoryId?: string;
  seriesId?: string;
  scope?: 'global' | 'local' | 'all';
}

const PRODUCT_INCLUDE = {
  manufacturer: true,
  category: true,
  subCategory: true,
} satisfies Prisma.ProductModelInclude;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async listProducts(params: ListProductsParams, user?: any) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 5000) : 20;

    const where: Prisma.ProductModelWhereInput = {};
    if (params.manufacturerId) where.manufacturerId = params.manufacturerId;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.seriesId) where.series = params.seriesId;

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
            { modelCode: { contains: q, mode: 'insensitive' } },
            { manufacturerName: { contains: q, mode: 'insensitive' } },
            { manufacturer: { nameNormalized: { contains: q.toLowerCase() } } },
            { series: { contains: q, mode: 'insensitive' } },
            { categoryName: { contains: q, mode: 'insensitive' } },
            { category: { nameNormalized: { contains: q.toLowerCase() } } },
            { color: { contains: q, mode: 'insensitive' } },
          ]
        });
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
      mrp: product.mrp ? Number(product.mrp) : null,
      gstRate: product.gstRate ? Number(product.gstRate) : null,
      discountPercent: product.discountPercent ? Number(product.discountPercent) : null,
    };
  }

  async saveProduct(dto: SaveProductDto, id?: string, user?: any) {
    if (!dto.manufacturerId && !dto.manufacturerName?.trim()) {
      throw new ConflictException('Manufacturer is required (pick one or type a name)');
    }
    if (!dto.categoryId && !dto.categoryName?.trim()) {
      throw new ConflictException('Category is required (pick one or type a name)');
    }

    if (id && user && user.role !== 'SUPERADMIN') {
      const existing = await this.prisma.productModel.findUnique({ where: { id } });
      if (!existing || existing.tenantId !== (user.adminId || user.id)) {
        throw new ConflictException('You cannot edit a global or foreign product');
      }
    }

    const productData: Prisma.ProductModelUncheckedUpdateInput = {
      name: dto.name?.trim() || null,
      manufacturerId: dto.manufacturerId ?? null,
      manufacturerName: dto.manufacturerName?.trim() || null,
      series: dto.series?.trim() || null,
      voltageClass: dto.voltageClass ?? null,
      categoryId: dto.categoryId ?? null,
      categoryName: dto.categoryName?.trim() || null,
      subCategoryId: dto.subCategoryId ?? null,
      subCategoryName: dto.subCategoryName?.trim() || null,
      color: dto.color?.trim() || null,
      modelCode: dto.modelCode?.trim() || null,
      attributes: (dto.attributes ?? {}) as Prisma.InputJsonValue,
      unit: dto.unit?.trim() || null,
      hsnCode: dto.hsnCode?.trim() || null,
      gstRate: dto.gstRate ?? null,
      mrp: dto.mrp ?? null,
      discountPercent: dto.discountPercent ?? null,
      images: (dto.images ?? { gallery: [] }) as Prisma.InputJsonValue,
      status: dto.status ?? 'ACTIVE',
    };

    if (!id && user && user.role !== 'SUPERADMIN') {
      productData.tenantId = user.adminId || user.id;
    }

    const product = id
      ? await this.prisma.productModel.update({ where: { id }, data: productData })
      : await this.prisma.productModel.create({ data: productData as Prisma.ProductModelCreateInput });

    return this.getProduct(product.id);
  }

  async deleteProduct(id: string, user?: any) {
    const existing = await this.prisma.productModel.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');
    
    if (user && user.role !== 'SUPERADMIN') {
      const tId = user.adminId || user.id;
      if (existing.tenantId !== tId) {
        throw new ConflictException('You cannot delete a global or foreign product');
      }
    }
    
    await this.prisma.productModel.delete({ where: { id } });
  }

  async deleteAllProducts() {
    await this.prisma.productModel.deleteMany({});
  }

  async exportProductRows(params: Omit<ListProductsParams, 'page' | 'limit'>, user?: any) {
    const { items } = await this.listProducts({ ...params, page: 1, limit: 5000 }, user);
    const rows: Array<Record<string, unknown>> = [];

    for (const p of items) {
      const specifications = await this.formatSpecifications(p.categoryId, p.attributes as Record<string, unknown>);
      rows.push({
        name: p.name ?? '',
        modelCode: p.modelCode ?? '',
        manufacturer: p.manufacturer?.name ?? p.manufacturerName ?? '',
        series: p.series ?? '',
        voltageClass: p.voltageClass ?? '',
        category: p.category?.name ?? p.categoryName ?? '',
        subCategory: p.subCategory?.name ?? p.subCategoryName ?? '',
        color: p.color ?? '',
        unit: p.unit ?? '',
        hsnCode: p.hsnCode ?? '',
        specifications,
        mrp: p.mrp,
        gstRate: p.gstRate,
        discountPercent: p.discountPercent,
        status: p.status,
      });
    }

    return rows;
  }

  async formatSpecifications(
    categoryId: string | null | undefined,
    attributes: Record<string, unknown>,
  ): Promise<string> {
    if (!categoryId) return '';
    const defs = await this.prisma.attributeDef.findMany({ where: { categoryId } });
    const parts: string[] = [];
    for (const def of defs) {
      const value = (attributes as Record<string, unknown>)?.[def.id];
      if (value === null || value === undefined || value === '') continue;
      parts.push(`${def.name}: ${value}`);
    }
    return parts.join('; ');
  }

  private toListRow(product: Prisma.ProductModelGetPayload<{ include: typeof PRODUCT_INCLUDE }>) {
    return {
      ...product,
      mrp: product.mrp ? Number(product.mrp) : null,
      gstRate: product.gstRate ? Number(product.gstRate) : null,
    };
  }
}
