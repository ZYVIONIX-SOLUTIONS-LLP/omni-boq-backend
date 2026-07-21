import { IsIn, IsString, MinLength } from 'class-validator';

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
}
