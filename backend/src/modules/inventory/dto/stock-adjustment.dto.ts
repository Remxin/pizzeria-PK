import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class StockAdjustmentDto {
  @IsInt()
  ingredientId: number;

  @IsInt()
  adjustment: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
