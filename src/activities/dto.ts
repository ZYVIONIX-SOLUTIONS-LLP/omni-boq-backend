import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

const WIRING_TYPES = ['POINT_WIRING', 'CIRCUIT_WIRING'] as const;
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
  @IsNumber()
  sortOrder?: number;
}

export class SheetDataDto {
  @IsOptional()
  @IsNumber()
  rowCount?: number;

  @IsOptional()
  @IsNumber()
  colCount?: number;

  @IsOptional()
  @IsArray()
  cells?: unknown[];

  @IsOptional()
  @IsArray()
  colWidths?: unknown[];

  @IsOptional()
  @IsArray()
  rowHeights?: unknown[];
}

export class CreateActivityDto {
  @IsString()
  name!: string;

  @IsIn(WIRING_TYPES)
  wiringType!: (typeof WIRING_TYPES)[number];

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
  @IsObject()
  @ValidateNested()
  @Type(() => SheetDataDto)
  sheetData?: SheetDataDto;

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
  @ValidateNested()
  @Type(() => SheetDataDto)
  sheetData?: SheetDataDto | null;

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
