import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

const PRODUCT_STATUSES = ['ACTIVE', 'INACTIVE', 'DISCONTINUED'] as const;
const VOLTAGE_CLASSES = ['LV', 'MV', 'HV', 'EHV'] as const;

export class SaveProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  manufacturerId?: string;

  @IsOptional()
  @IsString()
  manufacturerName?: string;

  @IsOptional()
  @IsString()
  series?: string;

  @IsOptional()
  @IsIn(VOLTAGE_CLASSES)
  voltageClass?: (typeof VOLTAGE_CLASSES)[number];

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  categoryName?: string;

  @IsOptional()
  @IsString()
  subCategoryId?: string;

  @IsOptional()
  @IsString()
  subCategoryName?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  modelCode?: string;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  hsnCode?: string;

  @IsOptional()
  @IsNumber()
  gstRate?: number;

  @IsOptional()
  @IsNumber()
  mrp?: number;

  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @IsOptional()
  @IsObject()
  images?: Record<string, unknown>;

  @IsOptional()
  @IsIn(PRODUCT_STATUSES)
  status?: (typeof PRODUCT_STATUSES)[number];
}
