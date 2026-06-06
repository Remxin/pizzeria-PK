import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateIngredientDto {
  @IsInt()
  @Min(1)
  categoryId: number;

  @IsString()
  @MaxLength(100)
  name: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitCost: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  priceForClient: number;

  @IsInt()
  @Min(0)
  stockQuantity: number;

  @IsInt()
  @Min(0)
  alertThreshold: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  @Max(5.0)
  defaultSize?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
