import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateProfileDto } from './dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  list(@Req() req: any, @Query('status') status?: string) {
    return this.service.list(req.user, status);
  }

  @Post()
  create(@Body() dto: CreateUserDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  @Patch('me')
  updateProfile(@Body() dto: UpdateProfileDto, @Req() req: any) {
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
