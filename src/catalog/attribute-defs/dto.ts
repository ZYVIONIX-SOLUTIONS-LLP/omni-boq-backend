import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

const ATTRIBUTE_TYPES = ['TEXT', 'NUMBER', 'SELECT', 'BOOLEAN'] as const;

export class CreateAttributeDefDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  categoryId!: string;

  @IsIn(ATTRIBUTE_TYPES)
  type!: (typeof ATTRIBUTE_TYPES)[number];

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAttributeDefDto extends PartialType(CreateAttributeDefDto) {}
