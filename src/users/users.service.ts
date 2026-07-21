import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
    });
  }

  async list() {
    const users = await this.prisma.user.findMany({ orderBy: { username: 'asc' } });
    return users.map(({ passwordHash: _passwordHash, ...safe }) => safe);
  }

  async create(dto: CreateUserDto) {
    const existing = await this.findByUsername(dto.username);
    if (existing) throw new ConflictException('Username already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
      },
    });

    const { passwordHash: _passwordHash, ...safe } = user;
    return safe;
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
  }
}
