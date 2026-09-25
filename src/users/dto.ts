import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

const ROLES = ['STAFF', 'ADMIN', 'SUPERADMIN'] as const;

export class CreateUserDto {
  @IsString()
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsIn(ROLES)
  role!: (typeof ROLES)[number];

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  priorityLevel?: number;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  gst?: string;

  @IsOptional()
  @IsString()
  companyAddress?: string;

  @IsOptional()
  companyCustomFields?: any;
}
