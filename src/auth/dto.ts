import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

const ROLES = ['STAFF', 'ADMIN', 'SUPERADMIN'] as const;

export class LoginDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsIn(ROLES)
  role!: (typeof ROLES)[number];
}

export class RegisterDto {
  @IsString()
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  email?: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

export class LogoutDto {
  @IsString()
  refreshToken!: string;
}
