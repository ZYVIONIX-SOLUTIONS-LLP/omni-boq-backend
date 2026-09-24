import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProductsService } from './products.service';
import { SaveProductDto } from './dto';

@Controller('catalog/products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  list(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('manufacturerId') manufacturerId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('seriesId') seriesId?: string,
    @Query('attributes') attributes?: string,
  ) {
    return this.service.listProducts({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      manufacturerId,
      categoryId,
      seriesId,
      attributes,
    }, req.user);
  }

  @Get('export')
  exportRows(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('manufacturerId') manufacturerId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('seriesId') seriesId?: string,
  ) {
    return this.service.exportProductRows({ search, manufacturerId, categoryId, seriesId }, req.user);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.getProduct(id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: SaveProductDto) {
    return this.service.saveProduct(dto, undefined, req.user);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: SaveProductDto) {
    return this.service.saveProduct(dto, id, req.user);
  }


  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.deleteProduct(id, req.user);
  }
}
