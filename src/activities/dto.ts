import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

const SEGMENTS = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'] as const;

export class ActivityRequirementDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  categoryId!: string;

  @IsString()
  description!: string;

  @IsString()
  unit!: string;

  @IsNumber()
  quantity!: number;

  @IsOptional()
  @IsString()
  subCategoryId?: string;

  @IsOptional()
  requiredAttributes?: any;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

/** A standalone cost line not tied to any category/product — labour, delivery, etc. */
export class ActivityChargeDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  description!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateActivityDto {
  @IsString()
  name!: string;

  @IsString()
  wiringType!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(SEGMENTS)
  segment?: (typeof SEGMENTS)[number];

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityRequirementDto)
  requirements!: ActivityRequirementDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityChargeDto)
  charges?: ActivityChargeDto[];

  @IsOptional()
  @IsNumber()
  labourCost?: number;
}

export class UpdateActivityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  wiringType?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(SEGMENTS)
  segment?: (typeof SEGMENTS)[number];

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityRequirementDto)
  requirements?: ActivityRequirementDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityChargeDto)
  charges?: ActivityChargeDto[];

  @IsOptional()
  @IsNumber()
  labourCost?: number | null;
}

export class DuplicateActivityDto {
  @IsString()
  name!: string;
}

export class CreateActivityTypeDto {
  @IsString()
  name!: string;
}

export class CreateActivityCategoryDto {
  @IsString()
  name!: string;
}
