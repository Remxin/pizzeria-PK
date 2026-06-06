import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
import { CustomPizzaService } from './custom-pizza.service';
import { CreateCustomPizzaDto } from './dto/create-custom-pizza.dto';
import { UpdateCustomPizzaDto } from './dto/update-custom-pizza.dto';

@ApiTags('Custom Pizzas')
@Controller('custom-pizzas')
export class CustomPizzaController {
  constructor(private readonly customPizzaService: CustomPizzaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'Save a custom pizza composition',
    description: 'Requires login. Price is calculated dynamically from ingredient prices.',
  })
  @ApiCreatedResponse({ description: 'Custom pizza saved with calculated totalPrice' })
  create(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateCustomPizzaDto,
  ) {
    return this.customPizzaService.create(user.id, dto);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'List current user custom pizzas or published pizzas' })
  @ApiQuery({ name: 'published', required: false, type: Boolean })
  @ApiOkResponse({ description: 'List of saved custom pizzas with ingredients' })
  findUserPizzas(
    @CurrentUser() user: JwtUser | undefined,
    @Query('published') published?: string,
  ) {
    if (published === 'true') {
      return this.customPizzaService.findPublishedPizzas();
    }

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    return this.customPizzaService.findUserPizzas(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get custom pizza by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Custom pizza with ingredients' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.customPizzaService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'Update custom pizza',
    description: 'Only the owner can update their custom pizza.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Updated custom pizza' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateCustomPizzaDto,
  ) {
    return this.customPizzaService.update(id, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'Delete custom pizza',
    description: 'Only the owner can delete their custom pizza.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Custom pizza deleted' })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.customPizzaService.delete(id, user.id);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'Publish or unpublish a custom pizza',
    description: 'Admin only. Makes a custom pizza visible in the public menu.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Custom pizza publish status updated' })
  publish(@Param('id', ParseIntPipe) id: number) {
    return this.customPizzaService.togglePublish(id);
  }
}
