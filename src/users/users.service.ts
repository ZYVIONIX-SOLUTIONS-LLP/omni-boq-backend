import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateProfileDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
    });
  }

  async list(user?: any, status?: string) {
    const where: any = {};
    if (user && user.role === 'ADMIN') {
      where.adminId = user.adminId || user.id; // Usually an ADMIN's own users share their adminId or id. Actually, users created by an ADMIN get adminId = ADMIN's id.
      // Wait, in `users.service.ts` create, we don't set adminId! Let me fix that later.
      where.adminId = user.id;
    }
    if (status) where.status = status;
    const users = await this.prisma.user.findMany({ where, orderBy: { username: 'asc' } });
    return users.map(({ passwordHash: _passwordHash, ...safe }) => safe);
  }

  async create(dto: CreateUserDto, user?: any) {
    const existing = await this.findByUsername(dto.username);
    if (existing) throw new ConflictException('Username already exists');

    let adminId = null;
    if (user && user.role === 'ADMIN') {
      adminId = user.adminId || user.id;
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        adminId,
      },
    });

    const { passwordHash: _passwordHash, ...safe } = newUser;
    return safe;
  }

  async approve(id: string) {
    const { passwordHash: _passwordHash, ...safe } = await this.prisma.user.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
    return safe;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const { passwordHash: _passwordHash, ...safe } = await this.prisma.user.update({
      where: { id },
      data: {
        companyName: dto.companyName,
        phone: dto.phone,
        gst: dto.gst,
        companyAddress: dto.companyAddress,
      },
    });
    return safe;
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
  }
}
