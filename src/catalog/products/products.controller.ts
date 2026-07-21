import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProductsService } from './products.service';
import { SaveProductDto } from './dto';

@Controller('catalog/products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('manufacturerId') manufacturerId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('seriesId') seriesId?: string,
  ) {
    return this.service.listProducts({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      manufacturerId,
      categoryId,
      seriesId,
    });
  }

  @Get('export')
  exportRows(
    @Query('search') search?: string,
    @Query('manufacturerId') manufacturerId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('seriesId') seriesId?: string,
  ) {
    return this.service.exportProductRows({ search, manufacturerId, categoryId, seriesId });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.getProduct(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: SaveProductDto) {
    return this.service.saveProduct(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: SaveProductDto) {
    return this.service.saveProduct(dto, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.service.deleteProduct(id);
  }
}
