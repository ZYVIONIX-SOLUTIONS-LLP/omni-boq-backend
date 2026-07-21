import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHsnCodeDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  gstRate?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateHsnCodeDto extends PartialType(CreateHsnCodeDto) {}
