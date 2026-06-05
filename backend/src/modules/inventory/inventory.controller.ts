import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
import { StockAdjustmentDto } from './dto/stock-adjustment.dto';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory')
@ApiAuthRequired()
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.EMPLOYEE, Role.ADMIN)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('adjust')
  @ApiOperation({
    summary: 'Manually adjust ingredient stock',
    description: 'Positive adjustment adds stock, negative subtracts. Stock cannot go below 0.',
  })
  @ApiOkResponse({ description: 'Updated ingredient with new stockQuantity' })
  adjustStock(@Body() dto: StockAdjustmentDto) {
    return this.inventoryService.adjustStock(dto);
  }

  @Get('alerts')
  @ApiOperation({
    summary: 'Get low stock alerts',
    description: 'Returns ingredients where stockQuantity <= alertThreshold.',
  })
  @ApiOkResponse({ description: 'List of low-stock ingredients' })
  getLowStockAlerts() {
    return this.inventoryService.getLowStockAlerts();
  }
}
