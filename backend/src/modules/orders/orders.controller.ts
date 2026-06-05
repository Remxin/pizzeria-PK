import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiAuthRequired } from '../../common/swagger/swagger.decorators';
import type { JwtUser } from '../../common/types/jwt-user.type';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Place a new order',
    description: `
Creates an order without payment processing. **No payment is required.**

- Authentication is optional (guests can order)
- If authenticated, order is linked to the user account
- Validates stock availability before creation
- Returns estimatedTime (minutes) for order completion
- Emits WebSocket event \`order:created\` to kitchen panel

Each item must have either \`productId\` (menu item) or \`customPizzaId\` (saved custom pizza).
Optional \`ingredients\` array on menu items allows adding extra toppings.
    `.trim(),
  })
  @ApiCreatedResponse({
    description: 'Order created with estimatedTime. Payment not required.',
  })
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: JwtUser | null,
  ) {
    return this.ordersService.create(dto, user?.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'List all orders (Employee/Admin)',
    description: 'Supports filtering by status, userId, and date range. Paginated.',
  })
  @ApiOkResponse({ description: 'Paginated list of orders' })
  findAll(@Query() query: OrderQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'Get orders for a specific user',
    description: 'Clients can only view their own orders. Employees and Admins can view any user.',
  })
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({ description: 'List of user orders' })
  findUserOrders(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.ordersService.findUserOrders(userId, user.id, user.role);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Public endpoint for order tracking. Use WebSocket order:join for real-time status updates.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Order details with items and ingredients' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findById(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'Update order status (Employee/Admin)',
    description: `
Status flow: NEW → IN_PREPARATION → READY → PICKED_UP → COMPLETED

When status changes to COMPLETED, ingredients are automatically deducted from inventory.
Emits WebSocket event \`order:statusChanged\`.
    `.trim(),
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Updated order' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
