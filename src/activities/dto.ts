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

const WIRING_TYPES = ['POINT_WIRING', 'CIRCUIT_WIRING'] as const;
const SEGMENTS = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'] as const;

export class ActivityRequirementOptionDto {
  @IsString()
  productModelId!: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

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
  @IsNumber()
  discountPercent?: number;

  @IsOptional()
  @IsNumber()
  taxPercent?: number;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  /** Alternate makes (specific catalog variants) this requirement can be fulfilled with.
   *  Omitted or empty means "simple" — the existing single-description behavior, unchanged. */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityRequirementOptionDto)
  options?: ActivityRequirementOptionDto[];
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

  @IsIn(WIRING_TYPES)
  wiringType!: (typeof WIRING_TYPES)[number];

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
  materialCost?: number;

  @IsOptional()
  @IsNumber()
  labourCost?: number;
}

export class UpdateActivityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(WIRING_TYPES)
  wiringType?: (typeof WIRING_TYPES)[number];

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
  materialCost?: number | null;

  @IsOptional()
  @IsNumber()
  labourCost?: number | null;
}

export class DuplicateActivityDto {
  @IsString()
  name!: string;
}
