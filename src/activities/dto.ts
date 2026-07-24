import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

const WIRING_TYPES = ['POINT_WIRING', 'CIRCUIT_WIRING'] as const;
const SEGMENTS = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'] as const;

export class ActivityRequirementOptionDto {
  @IsString()
  variantId!: string;

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
  sortOrder?: number;

  /** Alternate makes (specific catalog variants) this requirement can be fulfilled with.
   *  Omitted or empty means "simple" — the existing single-description behavior, unchanged. */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityRequirementOptionDto)
  options?: ActivityRequirementOptionDto[];
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

  /** Opaque spreadsheet workbook blob — shape owned by the frontend spreadsheet
   *  store (current multi-sheet form, or the older single-sheet form for records
   *  saved before sheet tabs existed), so it's stored as-is rather than validated
   *  field-by-field. */
  @IsOptional()
  @IsObject()
  sheetData?: Record<string, unknown>;

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
  @IsObject()
  sheetData?: Record<string, unknown> | null;

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
