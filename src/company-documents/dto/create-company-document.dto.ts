import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCompanyDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  fileType?: string;
}