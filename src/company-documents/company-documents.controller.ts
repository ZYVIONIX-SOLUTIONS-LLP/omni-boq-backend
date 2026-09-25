import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyDocumentsService } from './company-documents.service';
import { CreateCompanyDocumentDto } from './dto/create-company-document.dto';
import { UpdateCompanyDocumentDto } from './dto/update-company-document.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('company-documents')
export class CompanyDocumentsController {
  constructor(private readonly companyDocumentsService: CompanyDocumentsService) {}

  // Helper to extract tenantId
  private getTenantId(req: any): string {
    const user = req.user;
    return user?.adminId || user?.id; // Derived from logged-in user as requested
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/company-documents',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
  }))
  create(
    @Req() req: any, 
    @Body() createCompanyDocumentDto: CreateCompanyDocumentDto,
    @UploadedFile() file?: any
  ) {
    const tenantId = this.getTenantId(req);
    
    // If a file was uploaded, set the fileUrl and fileType
    if (file) {
      createCompanyDocumentDto.fileUrl = `/uploads/company-documents/${file.filename}`;
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