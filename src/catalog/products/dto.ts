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

const PRODUCT_STATUSES = ['ACTIVE', 'INACTIVE', 'DISCONTINUED'] as const;

export class PriceSetDto {
  @IsOptional()
  @IsNumber()
  mrp?: number;

  @IsOptional()
  @IsNumber()
  dealer?: number;

  @IsOptional()
  @IsNumber()
  distributor?: number;

  @IsOptional()
  @IsNumber()
  contractor?: number;

  @IsOptional()
  @IsNumber()
  purchase?: number;

  @IsOptional()
  @IsNumber()
  offer?: number;
}

export class VariantInputDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  modelCode?: string;

  @IsOptional()
  @IsString()
  manufacturerSku?: string;

  @IsOptional()
  @IsString()
  internalSku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  ean?: string;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, unknown>;

  @IsOptional()
  @ValidateNested()
  @Type(() => PriceSetDto)
  prices?: PriceSetDto;

  @IsOptional()
  @IsNumber()
  gstRate?: number;

  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @IsOptional()
  @IsNumber()
  stockQty?: number;

  @IsOptional()
  @IsIn(PRODUCT_STATUSES)
  status?: (typeof PRODUCT_STATUSES)[number];

  @IsOptional()
  @IsObject()
  image?: Record<string, unknown>;
}

export class SaveProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  manufacturerId?: string;

  @IsOptional()
  @IsString()
  manufacturerName?: string;

  @IsOptional()
  @IsString()
  divisionId?: string;

  @IsOptional()
  @IsString()
  seriesId?: string;

  @IsOptional()
  @IsString()
  seriesName?: string;

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
  @IsObject()
  attributes?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsOptional()
  @IsString()
  unitName?: string;

  @IsOptional()
  @IsString()
  hsnCode?: string;

  @IsOptional()
  @IsNumber()
  gstRate?: number;

  @IsOptional()
  @IsObject()
  images?: Record<string, unknown>;

  @IsOptional()
  @IsIn(PRODUCT_STATUSES)
  status?: (typeof PRODUCT_STATUSES)[number];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantInputDto)
  variants!: VariantInputDto[];
}
