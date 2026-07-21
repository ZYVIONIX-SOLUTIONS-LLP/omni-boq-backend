import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GenericCrudService } from '../generic/generic-crud.service';
import type { SubCategory } from '@prisma/client';

@Injectable()
export class SubCategoriesService extends GenericCrudService<SubCategory> {
  protected scopeFields = ['categoryId'];

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get delegate() {
    return this.prisma.subCategory;
  }
}
