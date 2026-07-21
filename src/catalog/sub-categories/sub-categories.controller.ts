import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ListQueryDto } from '../../common/dto/list-query.dto';
import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto';

@Controller('catalog/sub-categories')
export class SubCategoriesController {
  constructor(private readonly service: SubCategoriesService) {}

  @Get()
  list(@Query() query: ListQueryDto, @Query('categoryId') categoryId?: string) {
    return this.service.list({ ...query, filter: { categoryId } });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateSubCategoryDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateSubCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
