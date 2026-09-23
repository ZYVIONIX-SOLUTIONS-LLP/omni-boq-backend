import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GenericCrudService } from '../generic/generic-crud.service';
import type { CatalogCategory } from '@prisma/client';

@Injectable()
export class CategoriesService extends GenericCrudService<CatalogCategory> {
  protected searchFields = ['hsnCode'];
  protected scopeFields = ['tenantId'];

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get delegate() {
    return this.prisma.catalogCategory;
  }
}
