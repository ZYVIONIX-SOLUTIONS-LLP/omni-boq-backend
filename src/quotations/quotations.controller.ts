import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuotationsService } from './quotations.service';
import {
  CreateQuotationWithClientDto,
  QuotationItemDto,
  UpdateQuotationDto,
  UpdateQuotationStatusDto,
} from './dto';

@Controller('quotations')
export class QuotationsController {
  constructor(private readonly service: QuotationsService) {}

  @Get()
  list(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.service.list({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateQuotationWithClientDto) {
    return this.service.createWithClient(dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateQuotationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateQuotationStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }

  @Post(':id/items')
  @UseGuards(JwtAuthGuard)
  addItem(@Param('id') id: string, @Body() dto: QuotationItemDto) {
    return this.service.addItem(id, dto);
  }

  @Patch(':id/items/:itemId')
  @UseGuards(JwtAuthGuard)
  updateItem(@Param('id') id: string, @Param('itemId') itemId: string, @Body() dto: Partial<QuotationItemDto>) {
    return this.service.updateItem(id, itemId, dto);
  }

  @Delete(':id/items/:itemId')
  @UseGuards(JwtAuthGuard)
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.service.removeItem(id, itemId);
  }
}
