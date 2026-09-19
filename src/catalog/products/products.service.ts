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
  attributes?: string;
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

    
    if (params.attributes) {
      try {
        const parsedAttrs = JSON.parse(params.attributes);
        for (const [attrId, value] of Object.entries(parsedAttrs)) {
          if (value) {
            let typedValue: any = value;
            if (value === "true") typedValue = true;
            else if (value === "false") typedValue = false;
            else if (!isNaN(Number(value)) && String(value).trim() !== "") typedValue = Number(value);

            const orConditions: any[] = [
              { attributes: { path: [attrId], equals: value } },
              { attributes: { path: [attrId], array_contains: value } }
            ];

            if (typedValue !== value) {
              orConditions.push({ attributes: { path: [attrId], equals: typedValue } });
              orConditions.push({ attributes: { path: [attrId], array_contains: typedValue } });
            }

            if (!where.AND) where.AND = [];
            (where.AND as any[]).push({ OR: orConditions });
          }
        }
      } catch (e) {
      }
    }

    const [products, totalItems, allAgg] = await Promise.all([
      this.prisma.productModel.findMany({
        where,
        include: PRODUCT_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.productModel.count({ where }),
      this.prisma.productModel.findMany({
        where,
        select: {
          categoryId: true,
          attributes: true,
          series: true,
          category: { select: { name: true } }
        }
      })
    ]);

    
    const categoryAgg: Record<string, { categoryId: string, categoryName: string, attrs: Record<string, Set<string>>, series: Set<string> }> = {};
    const categoryIds = new Set<string>();

    for (const p of allAgg) {
      if (!p.categoryId) continue;
      if (!categoryAgg[p.categoryId as string]) {
        categoryAgg[p.categoryId as string] = {
          categoryId: p.categoryId,
          categoryName: p.category?.name || "",
          attrs: {},
          series: new Set<string>()
        };
        categoryIds.add(p.categoryId);
      }
      
      const attrs = p.attributes as Record<string, any>;
      if (attrs && typeof attrs === "object") {
        for (const [attrId, val] of Object.entries(attrs)) {
          if (val === null || val === undefined || val === "") continue;

          if (!categoryAgg[p.categoryId as string].attrs[attrId]) {
            categoryAgg[p.categoryId as string].attrs[attrId] = new Set<string>();
          }

          if (Array.isArray(val)) {
            val.forEach(v => {
              if (v !== null && v !== undefined && v !== "")
                categoryAgg[p.categoryId as string].attrs[attrId].add(String(v));
            });
          } else {
            categoryAgg[p.categoryId as string].attrs[attrId].add(String(val));
          }
        }
      }
      if (p.series) {
        categoryAgg[p.categoryId as string].series.add(String(p.series));
      }
    }

    const attributeDefs = await this.prisma.attributeDef.findMany({
      where: { categoryId: { in: Array.from(categoryIds) } },
      select: { id: true, name: true, categoryId: true, sortOrder: true }
    });
    const attrNameMap = new Map(attributeDefs.map(a => [a.id, a]));

    const filters = {
      categories: Object.values(categoryAgg).map(cat => {
        const catAttrs: any[] = [];
        for (const [attrId, valueSet] of Object.entries(cat.attrs)) {
          const def = attrNameMap.get(attrId);
          if (def) {
            catAttrs.push({
              id: attrId,
              name: def.name,
              sortOrder: def.sortOrder,
              values: Array.from(valueSet).sort()
            });
          }
        }
        return {
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          series: Array.from(cat.series ?? new Set<string>()).sort(),
          attributes: catAttrs.sort((a, b) => a.sortOrder - b.sortOrder).map(a => ({ id: a.id, name: a.name, values: a.values }))
        };
      }).sort((a, b) => a.categoryName.localeCompare(b.categoryName))
    };

    const items = products.map((p) => this.toListRow(p));
    return { items, meta: buildPageMeta(totalItems, page, limit), filters };
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

  async deleteAllProducts(categoryId?: string) {
    await this.prisma.productModel.deleteMany({
      where: categoryId ? { categoryId } : {},
    });
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
