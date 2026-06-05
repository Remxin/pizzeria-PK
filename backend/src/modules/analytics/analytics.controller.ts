import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiAuthRequired } from '../../common/swagger/swagger.decorators';
import { AnalyticsService } from './analytics.service';
import { DateRangeQueryDto, SalesPeriodQueryDto } from './dto/date-range-query.dto';

@ApiTags('Analytics')
@ApiAuthRequired()
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('products/popular')
  @ApiOperation({
    summary: 'Most popular products',
    description: 'Based on completed orders. Optional date range filter.',
  })
  @ApiOkResponse({ description: 'Products ranked by total quantity sold' })
  getPopularProducts(@Query() query: DateRangeQueryDto) {
    return this.analyticsService.getPopularProducts(query);
  }

  @Get('ingredients/popular')
  @ApiOperation({ summary: 'Most popular ingredients' })
  @ApiOkResponse({ description: 'Ingredients ranked by total quantity used' })
  getPopularIngredients(@Query() query: DateRangeQueryDto) {
    return this.analyticsService.getPopularIngredients(query);
  }

  @Get('ingredients/rare')
  @ApiOperation({ summary: 'Least used ingredients' })
  @ApiOkResponse({ description: 'Ingredients ranked by lowest usage' })
  getRareIngredients(@Query() query: DateRangeQueryDto) {
    return this.analyticsService.getRareIngredients(query);
  }

  @Get('sales/period')
  @ApiOperation({
    summary: 'Sales over time',
    description: 'Group completed orders by day, week, or month.',
  })
  @ApiOkResponse({ description: 'Revenue and order count per period' })
  getSalesByPeriod(@Query() query: SalesPeriodQueryDto) {
    return this.analyticsService.getSalesByPeriod(query);
  }

  @Get('profitability')
  @ApiOperation({
    summary: 'Profitability report',
    description: 'Revenue vs ingredient costs with margin per product.',
  })
  @ApiOkResponse({ description: 'Summary and per-product profitability' })
  getProfitabilityReport(@Query() query: DateRangeQueryDto) {
    return this.analyticsService.getProfitabilityReport(query);
  }

  @Get('suggestions')
  @ApiOperation({
    summary: 'Business suggestions',
    description: 'Restock alerts, removal candidates, and promotion ideas.',
  })
  @ApiOkResponse({ description: 'Restock, removal, and promotion suggestions' })
  getBusinessSuggestions() {
    return this.analyticsService.getBusinessSuggestions();
  }
}
