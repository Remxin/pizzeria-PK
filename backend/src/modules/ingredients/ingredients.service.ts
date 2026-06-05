import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { IngredientQueryDto } from './dto/ingredient-query.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateIngredientDto) {
    return this.prisma.ingredient.create({
      data: {
        ...dto,
        unitCost: new Prisma.Decimal(dto.unitCost),
        priceForClient: new Prisma.Decimal(dto.priceForClient),
      },
      include: { category: true },
    });
  }

  async findAll(query: IngredientQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    if (query.lowStock) {
      const conditions: Prisma.Sql[] = [
        Prisma.sql`"stockQuantity" <= "alertThreshold"`,
      ];

      if (query.categoryId) {
        conditions.push(Prisma.sql`"categoryId" = ${query.categoryId}`);
      }

      if (query.isAvailable !== undefined) {
        conditions.push(Prisma.sql`"isAvailable" = ${query.isAvailable}`);
      }

      const whereClause = Prisma.join(conditions, ' AND ');

      const [data, countResult] = await Promise.all([
        this.prisma.$queryRaw<
          Array<{
            id: number;
            categoryId: number;
            name: string;
            unitCost: Prisma.Decimal;
            priceForClient: Prisma.Decimal;
            stockQuantity: number;
            alertThreshold: number;
            unit: string;
            imageUrl: string | null;
            isAvailable: boolean;
            createdAt: Date;
            updatedAt: Date;
          }>
        >`
          SELECT *
          FROM "Ingredient"
          WHERE ${whereClause}
          ORDER BY name ASC
          LIMIT ${limit} OFFSET ${skip}
        `,
        this.prisma.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*)::bigint as count
          FROM "Ingredient"
          WHERE ${whereClause}
        `,
      ]);

      const total = Number(countResult[0]?.count ?? 0);

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

    const where: Prisma.IngredientWhereInput = {
      categoryId: query.categoryId,
      isAvailable: query.isAvailable,
    };

    const [data, total] = await Promise.all([
      this.prisma.ingredient.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.ingredient.count({ where }),
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
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    return ingredient;
  }

  async update(id: number, dto: UpdateIngredientDto) {
    await this.findById(id);

    return this.prisma.ingredient.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.unitCost !== undefined
          ? { unitCost: new Prisma.Decimal(dto.unitCost) }
          : {}),
        ...(dto.priceForClient !== undefined
          ? { priceForClient: new Prisma.Decimal(dto.priceForClient) }
          : {}),
      },
      include: { category: true },
    });
  }

  async delete(id: number) {
    await this.findById(id);

    return this.prisma.ingredient.update({
      where: { id },
      data: { isAvailable: false },
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
