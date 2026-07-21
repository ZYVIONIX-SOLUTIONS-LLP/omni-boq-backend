import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ListQueryDto } from '../../common/dto/list-query.dto';
import { AttributeDefsService } from './attribute-defs.service';
import { CreateAttributeDefDto, UpdateAttributeDefDto } from './dto';

@Controller('catalog/attribute-defs')
export class AttributeDefsController {
  constructor(private readonly service: AttributeDefsService) {}

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
  create(@Body() dto: CreateAttributeDefDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateAttributeDefDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
