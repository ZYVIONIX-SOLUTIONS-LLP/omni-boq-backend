import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto';

function parseDurationMs(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value.trim());
  if (!match) return 15 * 60 * 1000;
  const amount = Number(match[1]);
  const unitMs = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2]]!;
  return amount * unitMs;
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AuthService {
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.accessExpiresIn = this.config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    this.refreshExpiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByUsername(dto.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordOk) throw new UnauthorizedException('Invalid credentials');

    if (user.role !== dto.role) {
      throw new ForbiddenException(`This account is not authorized to log in as ${dto.role}`);
    }

    if (user.status === 'PENDING') {
      throw new ForbiddenException('Your account is pending Super Admin approval.');
    }

    let companyName = user.companyName ?? null;
    let email = user.email ?? null;
    let phone = user.phone ?? null;
    let gst = user.gst ?? null;
    let companyAddress = user.companyAddress ?? null;

    if (user.role === 'STAFF' && user.adminId) {
      const adminUser = await this.prisma.user.findUnique({ where: { id: user.adminId } });
      if (adminUser) {
        companyName = adminUser.companyName ?? null;
        email = adminUser.email ?? null;
        phone = adminUser.phone ?? null;
        gst = adminUser.gst ?? null;
        companyAddress = adminUser.companyAddress ?? null;
      }
    }

    const tokens = await this.issueTokens(user.id, user.username, user.role, user.adminId);
    return {
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName,
        email,
        phone,
        gst,
        companyAddress,
        roles: [user.role],
      },
      tokens,
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.users.findByUsername(dto.username);
    if (existing) throw new ConflictException('Username already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        companyName: dto.companyName ?? null,
        email: dto.email ?? null,
        phone: dto.phone ?? null,
        role: 'ADMIN',
        status: 'PENDING',
        adminId: null,
      },
    });

    return { message: 'Registration submitted. A Super Admin will review your account shortly.' };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; username: string; role: string; adminId?: string | null };
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokenHash = hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(payload.sub, payload.username, payload.role, payload.adminId);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async issueTokens(userId: string, username: string, role: string, adminId?: string | null) {
    const payload = { sub: userId, username, role, adminId: adminId ?? null };
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.accessExpiresIn as never,
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.refreshExpiresIn as never,
    });

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + parseDurationMs(this.refreshExpiresIn)),
      },
    });

    return { accessToken, refreshToken, expiresIn: this.accessExpiresIn };
  }
}
