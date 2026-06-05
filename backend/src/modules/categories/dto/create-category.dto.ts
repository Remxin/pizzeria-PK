import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { CategoryType } from '../../../common/enums/category-type.enum';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsEnum(CategoryType)
  type: CategoryType;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
