import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiAuthRequired } from '../../common/swagger/swagger.decorators';
import type { JwtUser } from '../../common/types/jwt-user.type';
import { CustomPizzaService } from './custom-pizza.service';
import { CreateCustomPizzaDto } from './dto/create-custom-pizza.dto';
import { UpdateCustomPizzaDto } from './dto/update-custom-pizza.dto';

@ApiTags('Custom Pizzas')
@ApiAuthRequired()
@Controller('custom-pizzas')
@UseGuards(JwtAuthGuard)
export class CustomPizzaController {
  constructor(private readonly customPizzaService: CustomPizzaService) {}

  @Post()
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
  @ApiOperation({ summary: 'List current user custom pizzas' })
  @ApiOkResponse({ description: 'List of saved custom pizzas with ingredients' })
  findUserPizzas(@CurrentUser() user: JwtUser) {
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
}
