import { IsEnum, IsOptional } from 'class-validator';
import { CategoryType } from '../../../common/enums/category-type.enum';

export class CategoryQueryDto {
  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;
}
