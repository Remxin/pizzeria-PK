import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CustomPizzaIngredientDto } from '../../custom-pizza/dto/custom-pizza-ingredient.dto';

export class CreateOrderItemDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Menu product ID. Provide either productId or customPizzaId.',
  })
  @ValidateIf((item: CreateOrderItemDto) => !item.customPizzaId)
  @IsInt()
  @Min(1)
  productId?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Saved custom pizza ID. Provide either productId or customPizzaId.',
  })
  @ValidateIf((item: CreateOrderItemDto) => !item.productId)
  @IsInt()
  @Min(1)
  customPizzaId?: number;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    type: [CustomPizzaIngredientDto],
    description: 'Extra ingredients for menu products (optional toppings)',
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CustomPizzaIngredientDto)
  ingredients?: CustomPizzaIngredientDto[];
}
