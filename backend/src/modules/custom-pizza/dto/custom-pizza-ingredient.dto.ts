import { IsInt, Min } from 'class-validator';

export class CustomPizzaIngredientDto {
  @IsInt()
  @Min(1)
  ingredientId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
