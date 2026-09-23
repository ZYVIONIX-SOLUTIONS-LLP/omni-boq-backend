import { Body, Controller, Request, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ListQueryDto } from '../../common/dto/list-query.dto';
import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto, UpdateManufacturerDto } from './dto';

@Controller('catalog/manufacturers')
export class ManufacturersController {
  constructor(private readonly service: ManufacturersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@Query() query: ListQueryDto, @Request() req: any) {
    return this.service.list(query, req.user);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateManufacturerDto, @Request() req: any) {
    const data = { ...dto } as any;
    if (req.user.role !== "SUPERADMIN") {
        data.tenantId = req.user.adminId || req.user.id;
    }
    return this.service.create(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateManufacturerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
