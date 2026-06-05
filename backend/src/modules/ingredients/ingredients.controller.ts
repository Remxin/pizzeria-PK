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
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiAuthRequired } from '../../common/swagger/swagger.decorators';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { IngredientQueryDto } from './dto/ingredient-query.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientsService } from './ingredients.service';

@ApiTags('Ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @ApiAuthRequired()
  @ApiOperation({ summary: 'Create an ingredient (Employee/Admin)' })
  @ApiCreatedResponse({ description: 'Ingredient created' })
  create(@Body() dto: CreateIngredientDto) {
    return this.ingredientsService.create(dto);
  }

  @Get('alerts/low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'Get low stock alerts',
    description: 'Returns ingredients where stockQuantity <= alertThreshold.',
  })
  @ApiOkResponse({ description: 'List of low-stock ingredients' })
  getLowStockAlerts() {
    return this.ingredientsService.getLowStockAlerts();
  }

  @Get()
  @ApiOperation({
    summary: 'List ingredients',
    description: 'Public endpoint for pizza creator. Supports lowStock filter for inventory view.',
  })
  @ApiOkResponse({ description: 'Paginated list of ingredients' })
  findAll(@Query() query: IngredientQueryDto) {
    return this.ingredientsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ingredient by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Ingredient details with category' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.ingredientsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @ApiAuthRequired()
  @ApiOperation({ summary: 'Update ingredient (Employee/Admin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Updated ingredient' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'Soft-delete ingredient (Admin only)',
    description: 'Sets isAvailable to false.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Ingredient marked as unavailable' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.ingredientsService.delete(id);
  }
}
