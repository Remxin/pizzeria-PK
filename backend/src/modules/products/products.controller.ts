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
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @ApiAuthRequired()
  @ApiOperation({ summary: 'Create a menu product (Employee/Admin)' })
  @ApiCreatedResponse({ description: 'Product created' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List menu products',
    description: 'Public endpoint. Supports pagination, category filter, availability filter, and search.',
  })
  @ApiOkResponse({ description: 'Paginated list of products' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Product details with category' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @ApiAuthRequired()
  @ApiOperation({ summary: 'Update product (Employee/Admin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Updated product' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'Soft-delete product (Admin only)',
    description: 'Sets isAvailable to false instead of permanently deleting.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Product marked as unavailable' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }
}
