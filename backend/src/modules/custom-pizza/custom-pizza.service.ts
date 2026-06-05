import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomPizzaDto } from './dto/create-custom-pizza.dto';
import { CustomPizzaIngredientDto } from './dto/custom-pizza-ingredient.dto';
import { UpdateCustomPizzaDto } from './dto/update-custom-pizza.dto';

@Injectable()
export class CustomPizzaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateCustomPizzaDto) {
    const totalPrice = await this.calculatePrice(dto.ingredients);

    return this.prisma.customPizza.create({
      data: {
        userId,
        name: dto.name ?? 'Moja Pizza',
        totalPrice,
        ingredients: {
          create: dto.ingredients.map((item) => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
      },
    });
  }

  async findUserPizzas(userId: number) {
    return this.prisma.customPizza.findMany({
      where: { userId },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    const customPizza = await this.prisma.customPizza.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
      },
    });

    if (!customPizza) {
      throw new NotFoundException('Custom pizza not found');
    }

    return customPizza;
  }

  async update(id: number, userId: number, dto: UpdateCustomPizzaDto) {
    const customPizza = await this.findById(id);

    if (customPizza.userId !== userId) {
      throw new ForbiddenException('You can only update your own custom pizzas');
    }

    const totalPrice = dto.ingredients
      ? await this.calculatePrice(dto.ingredients)
      : customPizza.totalPrice;

    return this.prisma.$transaction(async (tx) => {
      if (dto.ingredients) {
        await tx.customPizzaIngredient.deleteMany({
          where: { customPizzaId: id },
        });
      }

      return tx.customPizza.update({
        where: { id },
        data: {
          name: dto.name,
          totalPrice,
          ...(dto.ingredients
            ? {
                ingredients: {
                  create: dto.ingredients.map((item) => ({
                    ingredientId: item.ingredientId,
                    quantity: item.quantity,
                  })),
                },
              }
            : {}),
        },
        include: {
          ingredients: {
            include: { ingredient: true },
          },
        },
      });
    });
  }

  async delete(id: number, userId: number) {
    const customPizza = await this.findById(id);

    if (customPizza.userId !== userId) {
      throw new ForbiddenException('You can only delete your own custom pizzas');
    }

    return this.prisma.customPizza.delete({
      where: { id },
    });
  }

  async calculatePrice(ingredients: CustomPizzaIngredientDto[]) {
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

    let total = new Prisma.Decimal(0);

    for (const item of ingredients) {
      const ingredient = ingredientMap.get(item.ingredientId);
      if (!ingredient) {
        throw new BadRequestException(
          `Ingredient ${item.ingredientId} not found`,
        );
      }

      total = total.add(
        ingredient.priceForClient.mul(new Prisma.Decimal(item.quantity)),
      );
    }

    return total;
  }
}
