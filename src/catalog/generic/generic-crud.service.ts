import { ConflictException, NotFoundException } from '@nestjs/common';
import { buildPageMeta, normalizeName, PageMeta } from '../../common/pagination.util';

export interface GenericListParams {
  page?: number;
  limit?: number;
  search?: string;
  includeInactive?: boolean;
  filter?: Record<string, string | undefined>;
}

/**
 * Ports the frontend mock's EntityStore<T> behavior (app/lib/catalog/api.ts) onto a real
 * Prisma delegate: name-based search, isActive filtering, and a dedup-by-name(+scope) check
 * on create/update that used to be enforced in-memory and is now a real query.
 */
export abstract class GenericCrudService<T extends { id: string; name: string; isActive: boolean }> {
  /** e.g. () => this.prisma.manufacturer */
  protected abstract get delegate(): any;
  /** FK fields the name-uniqueness check is scoped by, e.g. ['manufacturerId'] */
  protected scopeFields: string[] = [];
  /** Extra fields (besides name) that `search` matches against, case-insensitively */
  protected searchFields: string[] = [];

  async list(params: GenericListParams): Promise<{ items: T[]; meta: PageMeta }> {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 5000) : 50;

    const where: Record<string, unknown> = {};
    if (!params.includeInactive) where.isActive = true;

    if (params.filter) {
      for (const [key, value] of Object.entries(params.filter)) {
        if (value !== undefined && value !== '') where[key] = value;
      }
    }

    if (params.search) {
      const q = params.search.trim().toLowerCase();
      if (q) {
        const orClauses: Record<string, unknown>[] = [{ nameNormalized: { contains: q } }];
        for (const field of this.searchFields) {
          orClauses.push({ [field]: { contains: params.search, mode: 'insensitive' } });
        }
        where.OR = orClauses;
      }
    }

    const [items, totalItems] = await Promise.all([
      this.delegate.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.delegate.count({ where }),
    ]);

    return { items, meta: buildPageMeta(totalItems, page, limit) };
  }

  async get(id: string): Promise<T | null> {
    return this.delegate.findUnique({ where: { id } });
  }

  async create<D extends { name: string }>(dto: D): Promise<T> {
    const data = dto as Record<string, unknown>;
    const name = String(data.name ?? '').trim();
    if (!name) throw new ConflictException('Name is required');

    await this.assertNoDuplicate(name, data, null);

    return this.delegate.create({
      data: { ...data, name, nameNormalized: normalizeName(name) },
    });
  }

  async update<D extends object>(id: string, dto: D): Promise<T> {
    const patch = dto as Record<string, unknown>;
    const existing = await this.get(id);
    if (!existing) throw new NotFoundException('Record not found');

    const name = patch.name !== undefined ? String(patch.name).trim() : existing.name;
    if (!name) throw new ConflictException('Name is required');

    const merged = { ...existing, ...patch, name };
    await this.assertNoDuplicate(name, merged, id);

    return this.delegate.update({
      where: { id },
      data: { ...patch, name, nameNormalized: normalizeName(name) },
    });
  }

  async remove(id: string): Promise<void> {
    try {
      await this.delegate.delete({ where: { id } });
    } catch (err) {
      if (this.isForeignKeyViolation(err)) {
        throw new ConflictException(
          'This item is still referenced elsewhere (e.g. products or sub-categories) and cannot be deleted until those are removed or reassigned.',
        );
      }
      throw err;
    }
  }

  private isForeignKeyViolation(err: unknown): boolean {
    const e = err as { code?: string; message?: string } | undefined;
    return (
      e?.code === 'P2003' ||
      Boolean(e?.message?.includes('23001')) ||
      Boolean(e?.message?.toLowerCase().includes('foreign key constraint'))
    );
  }

  private async assertNoDuplicate(
    name: string,
    data: Record<string, unknown>,
    ignoreId: string | null,
  ): Promise<void> {
    const where: Record<string, unknown> = { nameNormalized: normalizeName(name) };
    for (const field of this.scopeFields) where[field] = data[field] ?? null;
    if (ignoreId) where.id = { not: ignoreId };

    const dup = await this.delegate.findFirst({ where });
    if (dup) throw new ConflictException(`"${name}" already exists`);
  }
}
