import { IsIn, IsString } from 'class-validator';

const ROLES = ['STAFF', 'ADMIN', 'SUPERADMIN'] as const;

export class LoginDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsIn(ROLES)
  role!: (typeof ROLES)[number];
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

export class LogoutDto {
  @IsString()
  refreshToken!: string;
}
