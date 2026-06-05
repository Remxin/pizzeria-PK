import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StockAdjustmentDto } from './dto/stock-adjustment.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async deductStock(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            ingredients: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const stockRequirements = new Map<number, number>();

    for (const item of order.items) {
      for (const ingredient of item.ingredients) {
        const current = stockRequirements.get(ingredient.ingredientId) ?? 0;
        stockRequirements.set(
          ingredient.ingredientId,
          current + ingredient.quantity,
        );
      }
    }

    if (stockRequirements.size === 0) {
      return { deducted: [] };
    }

    return this.prisma.$transaction(async (tx) => {
      const deducted: Array<{
        ingredientId: number;
        previousStock: number;
        newStock: number;
        deducted: number;
      }> = [];

      for (const [ingredientId, requiredQuantity] of stockRequirements) {
        const ingredient = await tx.ingredient.findUnique({
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

        const updated = await tx.ingredient.update({
          where: { id: ingredientId },
          data: {
            stockQuantity: {
              decrement: requiredQuantity,
            },
          },
        });

        deducted.push({
          ingredientId,
          previousStock: ingredient.stockQuantity,
          newStock: updated.stockQuantity,
          deducted: requiredQuantity,
        });
      }

      return { deducted };
    });
  }

  async adjustStock(dto: StockAdjustmentDto) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id: dto.ingredientId },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    const newStock = ingredient.stockQuantity + dto.adjustment;

    if (newStock < 0) {
      throw new BadRequestException('Stock quantity cannot be negative');
    }

    return this.prisma.ingredient.update({
      where: { id: dto.ingredientId },
      data: {
        stockQuantity: newStock,
      },
      include: { category: true },
    });
  }

  async getLowStockAlerts() {
    return this.prisma.$queryRaw<
      Array<{
        id: number;
        name: string;
        stockQuantity: number;
        alertThreshold: number;
        unit: string;
        categoryId: number;
      }>
    >`
      SELECT id, name, "stockQuantity", "alertThreshold", unit, "categoryId"
      FROM "Ingredient"
      WHERE "stockQuantity" <= "alertThreshold"
        AND "isAvailable" = true
      ORDER BY "stockQuantity" ASC
    `;
  }
}
