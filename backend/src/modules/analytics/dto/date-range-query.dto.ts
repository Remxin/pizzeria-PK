import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export enum SalesGroupBy {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class DateRangeQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class SalesPeriodQueryDto extends DateRangeQueryDto {
  @IsOptional()
  @IsEnum(SalesGroupBy)
  groupBy?: SalesGroupBy = SalesGroupBy.DAY;
}
