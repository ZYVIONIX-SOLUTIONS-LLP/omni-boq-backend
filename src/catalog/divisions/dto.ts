import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateDivisionDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  manufacturerId!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateDivisionDto extends PartialType(CreateDivisionDto) {}
