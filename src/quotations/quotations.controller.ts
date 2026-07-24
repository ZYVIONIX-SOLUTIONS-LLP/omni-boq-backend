import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuotationsService } from './quotations.service';
import {
  CreateQuotationWithClientDto,
  QuotationItemDto,
  UpdateQuotationDto,
  UpdateQuotationStatusDto,
} from './dto';

@Controller('quotations')
@UseGuards(JwtAuthGuard)
export class QuotationsController {
  constructor(private readonly service: QuotationsService) {}

  @Get()
  list(@Req() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.service.list(
      {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      },
      req.user,
    );
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateQuotationWithClientDto) {
    return this.service.createWithClient(dto, req.user);
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.service.get(id, req.user);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateQuotationDto) {
    return this.service.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(id, req.user);
  }

  @Patch(':id/status')
  updateStatus(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateQuotationStatusDto) {
    return this.service.updateStatus(id, dto.status, req.user);
  }

  @Post(':id/items')
  addItem(@Req() req: any, @Param('id') id: string, @Body() dto: QuotationItemDto) {
    return this.service.addItem(id, dto, req.user);
  }

  @Patch(':id/items/:itemId')
  updateItem(
    @Req() req: any,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: Partial<QuotationItemDto>,
  ) {
    return this.service.updateItem(id, itemId, dto, req.user);
  }

  @Delete(':id/items/:itemId')
  removeItem(@Req() req: any, @Param('id') id: string, @Param('itemId') itemId: string) {
    return this.service.removeItem(id, itemId, req.user);
  }
}
