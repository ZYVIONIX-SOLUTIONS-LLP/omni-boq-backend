import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

const QUOTATION_STATUSES = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'] as const;

export class CreateQuotationWithClientDto {
  @IsString()
  clientName!: string;

  @IsOptional()
  @IsString()
  clientPhone?: string;

  @IsOptional()
  @IsString()
  clientAddress?: string;

  @IsString()
  projectName!: string;

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;
}

export class QuotationItemDto {
  @IsString()
  description!: string;

  @IsString()
  unit!: string;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  rate!: number;

  @IsOptional()
  @IsNumber()
  discountPct?: number;

  @IsOptional()
  @IsNumber()
  profitPct?: number;

  @IsOptional()
  @IsNumber()
  taxRate?: number;

  @IsOptional()
  @IsObject()
  snapshotData?: Record<string, unknown> | null;
}

export class UpdateQuotationStatusDto {
  @IsIn(QUOTATION_STATUSES)
  status!: (typeof QUOTATION_STATUSES)[number];
}

export class UpdateQuotationCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateQuotationProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;
}

export class UpdateQuotationDto {
  @IsOptional()
  @IsISO8601()
  validTill?: string;

  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @IsOptional()
  @IsObject()
  sheetData?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  activityRows?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  activityCustomizations?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  brandPreferences?: Record<string, unknown> | null;

  @IsOptional()
  @IsArray()
  items?: unknown[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateQuotationCustomerDto)
  customer?: UpdateQuotationCustomerDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateQuotationProjectDto)
  project?: UpdateQuotationProjectDto;
}
