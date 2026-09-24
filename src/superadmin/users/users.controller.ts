import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { SuperadminUsersService } from './users.service';
import { SuperadminCreateUserDto, SuperadminUpdateProfileDto } from './dto';

@Controller('superadmin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
export class SuperadminUsersController {
  constructor(private readonly service: SuperadminUsersService) {}

  @Get()
  list(@Req() req: any, @Query('status') status?: string) {
    return this.service.list(req.user, status);
  }

  @Post()
  create(@Body() dto: SuperadminCreateUserDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  @Patch('me')
  updateProfile(@Body() dto: SuperadminUpdateProfileDto, @Req() req: any) {
    return this.service.updateProfile(req.user.id, dto);
  }

  @Roles('SUPERADMIN')
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approve(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
