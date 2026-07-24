import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto, DuplicateActivityDto, UpdateActivityDto } from './dto';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Get()
  list(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('wiringType') wiringType?: string,
    @Query('segment') segment?: string,
    @Query('scope') scope?: 'global' | 'local' | 'all',
  ) {
    return this.service.list({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      wiringType,
      segment,
      scope,
    }, req.user);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateActivityDto) {
    return this.service.create(dto, req.user);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateActivityDto) {
    return this.service.update(id, dto, req.user);
  }

  @Delete('all')
  removeAll(@Req() req: any) {
    if (req.user?.role !== 'SUPERADMIN') {
      throw new ForbiddenException('Only SuperAdmin can delete all global activities');
    }
    return this.service.removeAll();
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(id, req.user);
  }

  @Post(':id/duplicate')
  duplicate(@Req() req: any, @Param('id') id: string, @Body() dto: DuplicateActivityDto) {
    return this.service.duplicate(id, dto.name, req.user);
  }
}

