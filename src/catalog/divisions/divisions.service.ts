import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GenericCrudService } from '../generic/generic-crud.service';
import type { Division } from '@prisma/client';

@Injectable()
export class DivisionsService extends GenericCrudService<Division> {
  protected scopeFields = ['manufacturerId'];

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get delegate() {
    return this.prisma.division;
  }
}
