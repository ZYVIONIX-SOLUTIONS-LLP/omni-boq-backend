import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}
