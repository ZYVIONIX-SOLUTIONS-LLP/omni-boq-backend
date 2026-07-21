import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ListQueryDto } from '../../common/dto/list-query.dto';
import { DivisionsService } from './divisions.service';
import { CreateDivisionDto, UpdateDivisionDto } from './dto';

@Controller('catalog/divisions')
export class DivisionsController {
  constructor(private readonly service: DivisionsService) {}

  @Get()
  list(@Query() query: ListQueryDto, @Query('manufacturerId') manufacturerId?: string) {
    return this.service.list({ ...query, filter: { manufacturerId } });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateDivisionDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateDivisionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
