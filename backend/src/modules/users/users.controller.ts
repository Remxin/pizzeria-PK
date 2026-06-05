import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiAuthRequired } from '../../common/swagger/swagger.decorators';
import type { JwtUser } from '../../common/types/jwt-user.type';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('employee')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'Create employee or admin account',
    description: 'Admin only. Regular registration (POST /auth/register) creates CLIENT accounts only.',
  })
  @ApiCreatedResponse({ description: 'Employee account created' })
  createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.usersService.createEmployee(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiAuthRequired()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'Current user data' })
  getProfile(@CurrentUser() user: JwtUser) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiAuthRequired()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ description: 'Updated user data' })
  updateProfile(
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get('me/orders')
  @UseGuards(JwtAuthGuard)
  @ApiAuthRequired()
  @ApiOperation({ summary: 'Get order history for current user' })
  @ApiOkResponse({ description: 'List of user orders with items and ingredients' })
  getMyOrders(@CurrentUser() user: JwtUser) {
    return this.usersService.getUserOrders(user.id);
  }
}
