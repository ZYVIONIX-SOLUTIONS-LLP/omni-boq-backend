import { Module } from '@nestjs/common';
import { CompanyDocumentsService } from './company-documents.service';
import { CompanyDocumentsController } from './company-documents.controller';
// import { PrismaModule } from '../prisma/prisma.module'; // Import your PrismaModule if applicable

@Module({
  // imports: [PrismaModule], // Uncomment if you have a PrismaModule exporting PrismaService
  controllers: [CompanyDocumentsController],
  providers: [CompanyDocumentsService],
})
export class CompanyDocumentsModule {}