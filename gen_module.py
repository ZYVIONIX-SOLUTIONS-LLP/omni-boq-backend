import os

base_dir = r"c:\Users\pvish\Zyvionix\Omni Projects\omni-boq-backend\src\company-documents"
os.makedirs(os.path.join(base_dir, "dto"), exist_ok=True)

with open(os.path.join(base_dir, "dto", "create-company-document.dto.ts"), "w") as f:
    f.write('''import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCompanyDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  fileType?: string;
}
''')

with open(os.path.join(base_dir, "dto", "update-company-document.dto.ts"), "w") as f:
    f.write('''import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDocumentDto } from './create-company-document.dto';

export class UpdateCompanyDocumentDto extends PartialType(CreateCompanyDocumentDto) {}
''')

with open(os.path.join(base_dir, "company-documents.service.ts"), "w") as f:
    f.write('''import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
      throw new NotFoundException(CompanyDocument with ID  not found);
    }

    return document;
  }

  async update(id: string, updateCompanyDocumentDto: UpdateCompanyDocumentDto, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.companyDocument.update({
      where: { id },
      data: updateCompanyDocumentDto,
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.companyDocument.delete({
      where: { id },
    });
  }
}
''')

with open(os.path.join(base_dir, "company-documents.controller.ts"), "w") as f:
    f.write('''import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyDocumentsService } from './company-documents.service';
import { CreateCompanyDocumentDto } from './dto/create-company-document.dto';
import { UpdateCompanyDocumentDto } from './dto/update-company-document.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('company-documents')
export class CompanyDocumentsController {
  constructor(private readonly companyDocumentsService: CompanyDocumentsService) {}

  private getTenantId(req: any): string {
    const user = req.user;
    return user?.adminId || user?.id;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/company-documents',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = ${file.fieldname}-;
        callback(null, filename);
      },
    }),
  }))
  create(
    @Req() req: any, 
    @Body() createCompanyDocumentDto: CreateCompanyDocumentDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const tenantId = this.getTenantId(req);
    
    if (file) {
      createCompanyDocumentDto.fileUrl = /uploads/company-documents/;
      createCompanyDocumentDto.fileType = file.mimetype;
    }

    return this.companyDocumentsService.create(createCompanyDocumentDto, tenantId);
  }

  @Get()
  findAll(@Req() req: any) {
    const tenantId = this.getTenantId(req);
    return this.companyDocumentsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const tenantId = this.getTenantId(req);
    return this.companyDocumentsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDocumentDto: UpdateCompanyDocumentDto, @Req() req: any) {
    const tenantId = this.getTenantId(req);
    return this.companyDocumentsService.update(id, updateCompanyDocumentDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const tenantId = this.getTenantId(req);
    return this.companyDocumentsService.remove(id, tenantId);
  }
}
''')

with open(os.path.join(base_dir, "company-documents.module.ts"), "w") as f:
    f.write('''import { Module } from '@nestjs/common';
import { CompanyDocumentsService } from './company-documents.service';
import { CompanyDocumentsController } from './company-documents.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyDocumentsController],
  providers: [CompanyDocumentsService],
})
export class CompanyDocumentsModule {}
''')
print("Module generated!")
