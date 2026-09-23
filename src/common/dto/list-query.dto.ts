import { Transform 
  @IsOptional()
  @IsString()
  scope?: "global" | "local" | "all";
} from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min 
  @IsOptional()
  @IsString()
  scope?: "global" | "local" | "all";
} from 'class-validator';

export class ListQueryDto {
  @IsOptional()
  @Transform(({ value 
  @IsOptional()
  @IsString()
  scope?: "global" | "local" | "all";
}) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value 
  @IsOptional()
  @IsString()
  scope?: "global" | "local" | "all";
}) => Number(value))
  @IsInt()
  @Min(1)
  @Max(5000)
  limit?: number = 50;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value 
  @IsOptional()
  @IsString()
  scope?: "global" | "local" | "all";
}) => value === 'true' || value === true)
  @IsBoolean()
  includeInactive?: boolean = false;

  @IsOptional()
  @IsString()
  scope?: "global" | "local" | "all";
}
