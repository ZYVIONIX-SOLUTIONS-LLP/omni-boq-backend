import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path if needed
import { CreateCompanyDocumentDto } from './dto/create-company-document.dto';
import { UpdateCompanyDocumentDto } from './dto/update-company-document.dto';

@Injectable()
export class CompanyDocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDocumentDto: CreateCompanyDocumentDto, tenantId: string) {
    return this.prisma.companyDocument.create({
      data: {
        ...createCompanyDocumentDto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.companyDocument.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const document = await this.prisma.companyDocument.findFirst({
      where: { id, tenantId },
    });

    if (!document) {
      throw new NotFoundException(`CompanyDocument with ID ${id} not found`);
    }

    return document;
  }

  async update(id: string, updateCompanyDocumentDto: UpdateCompanyDocumentDto, tenantId: string) {
    // Ensure document exists and belongs to tenant
    await this.findOne(id, tenantId);

    return this.prisma.companyDocument.update({
      where: { id },
      data: updateCompanyDocumentDto,
    });
  }

  async remove(id: string, tenantId: string) {
    // Ensure document exists and belongs to tenant
    await this.findOne(id, tenantId);

    return this.prisma.companyDocument.delete({
      where: { id },
    });
  }
}