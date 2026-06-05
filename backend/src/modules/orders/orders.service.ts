import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DeliveryType } from '../../common/enums/delivery-type.enum';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { Role } from '../../common/enums/role.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { OrdersGateway } from './orders.gateway';

interface PreparedOrderItem {
  productId?: number;
  customPizzaId?: number;
  quantity: number;
  unitPrice: Prisma.Decimal;
  itemName: string;
  ingredients: Array<{
    ingredientId: number;
    quantity: number;
    unitCost: Prisma.Decimal;
    priceForClient: Prisma.Decimal;
    ingredientName: string;
  }>;
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async create(dto: CreateOrderDto, userId?: number) {
    if (dto.deliveryType === DeliveryType.DELIVERY && !dto.deliveryAddress) {
      throw new BadRequestException(
        'Delivery address is required for delivery orders',
      );
    }

    const preparedItems = await this.prepareOrderItems(dto.items);
    await this.validateStockAvailability(preparedItems);

    const totalPrice = preparedItems.reduce(
      (sum, item) => sum.add(item.unitPrice.mul(item.quantity)),
      new Prisma.Decimal(0),
    );

    const estimatedTime = this.calculateEstimatedTime(preparedItems);

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          deliveryType: dto.deliveryType,
          deliveryAddress: dto.deliveryAddress,
          customerPhone: dto.customerPhone,
          notes: dto.notes,
          estimatedTime,
          items: {
            create: preparedItems.map((item) => ({
              productId: item.productId,
              customPizzaId: item.customPizzaId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              itemName: item.itemName,
              ingredients: {
                create: item.ingredients.map((ingredient) => ({
                  ingredientId: ingredient.ingredientId,
                  quantity: ingredient.quantity,
                  unitCost: ingredient.unitCost,
                  priceForClient: ingredient.priceForClient,
                  ingredientName: ingredient.ingredientName,
                })),
              },
            })),
          },
        },
        include: {
          items: {
            include: {
              ingredients: true,
              product: true,
              customPizza: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
      });

      return createdOrder;
    });

    this.ordersGateway.emitOrderCreated(order);

    return order;
  }

  async findAll(query: OrderQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      status: query.status,
      userId: query.userId,
      ...(query.startDate || query.endDate
        ? {
            createdAt: {
              ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
              ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              ingredients: true,
              product: true,
              customPizza: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            ingredients: true,
            product: true,
            customPizza: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findUserOrders(userId: number, requesterId: number, requesterRole: Role) {
    if (
      requesterId !== userId &&
      requesterRole !== Role.ADMIN &&
      requesterRole !== Role.EMPLOYEE
    ) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            ingredients: true,
            product: true,
            customPizza: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, status: OrderStatus) {
    const order = await this.findById(id);

    if (status === OrderStatus.COMPLETED && order.status !== OrderStatus.COMPLETED) {
      await this.inventoryService.deductStock(id);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            ingredients: true,
            product: true,
            customPizza: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    this.ordersGateway.emitOrderStatusChanged(id, status, updatedOrder);

    return updatedOrder;
  }

  calculateEstimatedTime(items: PreparedOrderItem[]): number {
    const baseTime = 30;
    const perItemTime = 5;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return baseTime + totalItems * perItemTime;
  }

  private async prepareOrderItems(
    items: CreateOrderItemDto[],
  ): Promise<PreparedOrderItem[]> {
    const preparedItems: PreparedOrderItem[] = [];

    for (const item of items) {
      if (!item.productId && !item.customPizzaId) {
        throw new BadRequestException(
          'Each order item must have either productId or customPizzaId',
        );
      }

      if (item.productId && item.customPizzaId) {
        throw new BadRequestException(
          'Order item cannot have both productId and customPizzaId',
        );
      }

      if (item.productId) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isAvailable) {
          throw new BadRequestException(
            `Product ${item.productId} is unavailable`,
          );
        }

        let unitPrice = product.basePrice;
        const ingredients: PreparedOrderItem['ingredients'] = [];

        if (item.ingredients?.length) {
          const extraIngredients = await this.resolveIngredients(
            item.ingredients,
          );

          for (const extra of extraIngredients) {
            unitPrice = unitPrice.add(
              extra.priceForClient.mul(extra.quantity),
            );
            ingredients.push(extra);
          }
        }

        preparedItems.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice,
          itemName: product.name,
          ingredients,
        });
        continue;
      }

      const customPizza = await this.prisma.customPizza.findUnique({
        where: { id: item.customPizzaId },
        include: {
          ingredients: {
            include: { ingredient: true },
          },
        },
      });

      if (!customPizza) {
        throw new NotFoundException(
          `Custom pizza ${item.customPizzaId} not found`,
        );
      }

      const ingredients = customPizza.ingredients.map((entry) => ({
        ingredientId: entry.ingredientId,
        quantity: entry.quantity,
        unitCost: entry.ingredient.unitCost,
        priceForClient: entry.ingredient.priceForClient,
        ingredientName: entry.ingredient.name,
      }));

      preparedItems.push({
        customPizzaId: customPizza.id,
        quantity: item.quantity,
        unitPrice: customPizza.totalPrice,
        itemName: customPizza.name,
        ingredients,
      });
    }

    return preparedItems;
  }

  private async resolveIngredients(
    ingredients: Array<{ ingredientId: number; quantity: number }>,
  ) {
    const ingredientIds = ingredients.map((item) => item.ingredientId);
    const dbIngredients = await this.prisma.ingredient.findMany({
      where: {
        id: { in: ingredientIds },
        isAvailable: true,
      },
    });

    if (dbIngredients.length !== ingredientIds.length) {
      throw new BadRequestException('One or more ingredients are unavailable');
    }

    const ingredientMap = new Map(
      dbIngredients.map((ingredient) => [ingredient.id, ingredient]),
    );

    return ingredients.map((item) => {
      const ingredient = ingredientMap.get(item.ingredientId);
      if (!ingredient) {
        throw new BadRequestException(
          `Ingredient ${item.ingredientId} not found`,
        );
      }

      return {
        ingredientId: ingredient.id,
        quantity: item.quantity,
        unitCost: ingredient.unitCost,
        priceForClient: ingredient.priceForClient,
        ingredientName: ingredient.name,
      };
    });
  }

  private async validateStockAvailability(items: PreparedOrderItem[]) {
    const stockRequirements = new Map<number, number>();

    for (const item of items) {
      for (const ingredient of item.ingredients) {
        const required = ingredient.quantity * item.quantity;
        const current = stockRequirements.get(ingredient.ingredientId) ?? 0;
        stockRequirements.set(ingredient.ingredientId, current + required);
      }
    }

    for (const [ingredientId, requiredQuantity] of stockRequirements) {
      const ingredient = await this.prisma.ingredient.findUnique({
        where: { id: ingredientId },
      });

      if (!ingredient) {
        throw new NotFoundException(`Ingredient ${ingredientId} not found`);
      }

      if (ingredient.stockQuantity < requiredQuantity) {
        throw new BadRequestException(
          `Insufficient stock for ingredient: ${ingredient.name}`,
        );
      }
    }
  }
}
