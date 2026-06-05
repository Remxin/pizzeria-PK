import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { DateRangeQueryDto, SalesGroupBy, SalesPeriodQueryDto } from './dto/date-range-query.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildDateFilter(query: DateRangeQueryDto): Prisma.OrderWhereInput {
    if (!query.startDate && !query.endDate) {
      return {};
    }

    return {
      createdAt: {
        ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
        ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
      },
    };
  }

  async getPopularProducts(query: DateRangeQueryDto) {
    const dateFilter = this.buildDateFilter(query);

    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        order: {
          status: OrderStatus.COMPLETED,
          ...dateFilter,
        },
      },
      select: {
        itemName: true,
        productId: true,
        customPizzaId: true,
        quantity: true,
      },
    });

    const productStats = new Map<
      string,
      {
        itemName: string;
        productId: number | null;
        customPizzaId: number | null;
        orderCount: number;
        totalQuantity: number;
      }
    >();

    for (const item of orderItems) {
      const key = `${item.productId ?? 'null'}-${item.customPizzaId ?? 'null'}-${item.itemName}`;
      const current = productStats.get(key) ?? {
        itemName: item.itemName,
        productId: item.productId,
        customPizzaId: item.customPizzaId,
        orderCount: 0,
        totalQuantity: 0,
      };

      current.orderCount += 1;
      current.totalQuantity += item.quantity;
      productStats.set(key, current);
    }

    return Array.from(productStats.values()).sort(
      (a, b) => b.totalQuantity - a.totalQuantity,
    );
  }

  async getPopularIngredients(query: DateRangeQueryDto) {
    const dateFilter = this.buildDateFilter(query);

    const ingredients = await this.prisma.orderItemIngredient.findMany({
      where: {
        orderItem: {
          order: {
            status: OrderStatus.COMPLETED,
            ...dateFilter,
          },
        },
      },
      select: {
        ingredientId: true,
        ingredientName: true,
        quantity: true,
      },
    });

    const stats = new Map<
      number,
      { ingredientId: number; ingredientName: string; totalQuantity: number }
    >();

    for (const ingredient of ingredients) {
      const current = stats.get(ingredient.ingredientId) ?? {
        ingredientId: ingredient.ingredientId,
        ingredientName: ingredient.ingredientName,
        totalQuantity: 0,
      };

      current.totalQuantity += ingredient.quantity;
      stats.set(ingredient.ingredientId, current);
    }

    return Array.from(stats.values()).sort(
      (a, b) => b.totalQuantity - a.totalQuantity,
    );
  }

  async getRareIngredients(query: DateRangeQueryDto) {
    const popular = await this.getPopularIngredients(query);
    return popular.sort((a, b) => a.totalQuantity - b.totalQuantity);
  }

  async getSalesByPeriod(query: SalesPeriodQueryDto) {
    const dateFilter = this.buildDateFilter(query);
    const groupBy = query.groupBy ?? SalesGroupBy.DAY;

    const orders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
        ...dateFilter,
      },
      select: {
        createdAt: true,
        totalPrice: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const salesMap = new Map<string, { period: string; revenue: number; orderCount: number }>();

    for (const order of orders) {
      const period = this.formatPeriod(order.createdAt, groupBy);
      const current = salesMap.get(period) ?? {
        period,
        revenue: 0,
        orderCount: 0,
      };

      current.revenue += Number(order.totalPrice);
      current.orderCount += 1;
      salesMap.set(period, current);
    }

    return Array.from(salesMap.values());
  }

  async getProfitabilityReport(query: DateRangeQueryDto) {
    const dateFilter = this.buildDateFilter(query);

    const orders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
        ...dateFilter,
      },
      include: {
        items: {
          include: {
            ingredients: true,
          },
        },
      },
    });

    let totalRevenue = 0;
    let totalCost = 0;
    const productMargins = new Map<
      string,
      {
        itemName: string;
        revenue: number;
        cost: number;
        quantity: number;
      }
    >();

    for (const order of orders) {
      totalRevenue += Number(order.totalPrice);

      for (const item of order.items) {
        const itemRevenue = Number(item.unitPrice) * item.quantity;
        let itemCost = 0;

        for (const ingredient of item.ingredients) {
          itemCost += Number(ingredient.unitCost) * ingredient.quantity * item.quantity;
        }

        totalCost += itemCost;

        const current = productMargins.get(item.itemName) ?? {
          itemName: item.itemName,
          revenue: 0,
          cost: 0,
          quantity: 0,
        };

        current.revenue += itemRevenue;
        current.cost += itemCost;
        current.quantity += item.quantity;
        productMargins.set(item.itemName, current);
      }
    }

    const products = Array.from(productMargins.values()).map((product) => ({
      ...product,
      margin:
        product.revenue > 0
          ? ((product.revenue - product.cost) / product.revenue) * 100
          : 0,
    }));

    return {
      summary: {
        totalRevenue,
        totalCost,
        totalMargin:
          totalRevenue > 0
            ? ((totalRevenue - totalCost) / totalRevenue) * 100
            : 0,
      },
      products: products.sort((a, b) => b.margin - a.margin),
    };
  }

  async getBusinessSuggestions() {
    const [lowStock, popularIngredients, profitability] = await Promise.all([
      this.prisma.$queryRaw<
        Array<{
          id: number;
          name: string;
          stockQuantity: number;
          alertThreshold: number;
        }>
      >`
        SELECT id, name, "stockQuantity", "alertThreshold"
        FROM "Ingredient"
        WHERE "stockQuantity" <= "alertThreshold"
          AND "isAvailable" = true
      `,
      this.getPopularIngredients({}),
      this.getProfitabilityReport({}),
    ]);

    const popularMap = new Map(
      popularIngredients.map((item) => [item.ingredientId, item.totalQuantity]),
    );

    const restockSuggestions = lowStock
      .filter((ingredient) => (popularMap.get(ingredient.id) ?? 0) > 0)
      .map((ingredient) => ({
        type: 'RESTOCK' as const,
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        message: `Restock ${ingredient.name} - low stock (${ingredient.stockQuantity}/${ingredient.alertThreshold}) with high demand`,
      }));

    const rareIngredients = await this.getRareIngredients({});
    const allIngredients = await this.prisma.ingredient.findMany({
      where: { isAvailable: true },
      select: { id: true, name: true, unitCost: true },
    });

    const rareIds = new Set(rareIngredients.slice(0, 10).map((item) => item.ingredientId));

    const removalSuggestions = allIngredients
      .filter((ingredient) => rareIds.has(ingredient.id))
      .filter((ingredient) => Number(ingredient.unitCost) > 5)
      .map((ingredient) => ({
        type: 'REMOVE' as const,
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        message: `Consider removing ${ingredient.name} - rarely used with high unit cost`,
      }));

    const promotionSuggestions = profitability.products
      .filter((product) => product.margin > 40 && product.quantity >= 3)
      .slice(0, 5)
      .map((product) => ({
        type: 'PROMOTE' as const,
        itemName: product.itemName,
        message: `Promote ${product.itemName} - high margin (${product.margin.toFixed(1)}%) and good sales`,
      }));

    return {
      restock: restockSuggestions,
      removal: removalSuggestions,
      promotion: promotionSuggestions,
    };
  }

  private formatPeriod(date: Date, groupBy: SalesGroupBy): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (groupBy === SalesGroupBy.MONTH) {
      return `${year}-${month}`;
    }

    if (groupBy === SalesGroupBy.WEEK) {
      const week = this.getWeekNumber(date);
      return `${year}-W${String(week).padStart(2, '0')}`;
    }

    return `${year}-${month}-${day}`;
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;

    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}
