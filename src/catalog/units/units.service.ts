import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GenericCrudService } from '../generic/generic-crud.service';
import type { UnitDef } from '@prisma/client';

@Injectable()
export class UnitsService extends GenericCrudService<UnitDef> {
  protected searchFields = ['symbol'];

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected get delegate() {
    return this.prisma.unitDef;
  }
}
