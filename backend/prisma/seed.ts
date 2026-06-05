import { PrismaClient, Role, CategoryType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const employeePasswordHash = await bcrypt.hash('employee123', 10);
  const clientPasswordHash = await bcrypt.hash('client123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pizza.local' },
    update: {},
    create: {
      email: 'admin@pizza.local',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      fullName: 'Administrator',
      phone: '+48123456789',
    },
  });

  await prisma.user.upsert({
    where: { email: 'employee@pizza.local' },
    update: {},
    create: {
      email: 'employee@pizza.local',
      passwordHash: employeePasswordHash,
      role: Role.EMPLOYEE,
      fullName: 'Jan Kowalski',
      phone: '+48987654321',
    },
  });

  await prisma.user.upsert({
    where: { email: 'client@pizza.local' },
    update: {},
    create: {
      email: 'client@pizza.local',
      passwordHash: clientPasswordHash,
      role: Role.CLIENT,
      fullName: 'Anna Nowak',
      phone: '+48555111222',
      address: 'ul. Pizzowa 1, Warszawa',
    },
  });

  const productCategories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Pizze klasyczne' },
      update: {},
      create: {
        name: 'Pizze klasyczne',
        description: 'Tradycyjne pizze z menu',
        type: CategoryType.PRODUCT,
        displayOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Napoje' },
      update: {},
      create: {
        name: 'Napoje',
        description: 'Napoje i dodatki',
        type: CategoryType.PRODUCT,
        displayOrder: 2,
      },
    }),
  ]);

  const ingredientCategories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Sosy' },
      update: {},
      create: {
        name: 'Sosy',
        type: CategoryType.INGREDIENT,
        displayOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Mięso' },
      update: {},
      create: {
        name: 'Mięso',
        type: CategoryType.INGREDIENT,
        displayOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Warzywa' },
      update: {},
      create: {
        name: 'Warzywa',
        type: CategoryType.INGREDIENT,
        displayOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Sery' },
      update: {},
      create: {
        name: 'Sery',
        type: CategoryType.INGREDIENT,
        displayOrder: 4,
      },
    }),
  ]);

  const [pizzaCategory, drinksCategory] = productCategories;
  const [sauceCategory, meatCategory, veggieCategory, cheeseCategory] =
    ingredientCategories;

  const products = [
    {
      categoryId: pizzaCategory.id,
      name: 'Margherita',
      description: 'Klasyczna pizza z sosem pomidorowym i mozzarellą',
      basePrice: 28.0,
      isAvailable: true,
    },
    {
      categoryId: pizzaCategory.id,
      name: 'Pepperoni',
      description: 'Pizza z salami pepperoni i mozzarellą',
      basePrice: 34.0,
      isAvailable: true,
    },
    {
      categoryId: drinksCategory.id,
      name: 'Coca-Cola 0.5L',
      description: 'Napój gazowany',
      basePrice: 8.0,
      isAvailable: true,
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: product,
      });
    } else {
      await prisma.product.create({ data: product });
    }
  }

  const ingredients = [
    {
      name: 'Sos pomidorowy',
      categoryId: sauceCategory.id,
      unitCost: 1.5,
      priceForClient: 3.0,
      stockQuantity: 5000,
      alertThreshold: 500,
      unit: 'ml',
    },
    {
      name: 'Mozzarella',
      categoryId: cheeseCategory.id,
      unitCost: 2.0,
      priceForClient: 5.0,
      stockQuantity: 3000,
      alertThreshold: 300,
      unit: 'g',
    },
    {
      name: 'Pepperoni',
      categoryId: meatCategory.id,
      unitCost: 3.5,
      priceForClient: 7.0,
      stockQuantity: 2000,
      alertThreshold: 200,
      unit: 'g',
    },
    {
      name: 'Pieczarki',
      categoryId: veggieCategory.id,
      unitCost: 1.2,
      priceForClient: 4.0,
      stockQuantity: 1500,
      alertThreshold: 150,
      unit: 'g',
    },
    {
      name: 'Cebula',
      categoryId: veggieCategory.id,
      unitCost: 0.5,
      priceForClient: 2.0,
      stockQuantity: 1000,
      alertThreshold: 100,
      unit: 'g',
    },
    {
      name: 'Parmezan',
      categoryId: cheeseCategory.id,
      unitCost: 4.0,
      priceForClient: 6.0,
      stockQuantity: 800,
      alertThreshold: 80,
      unit: 'g',
    },
  ];

  for (const ingredient of ingredients) {
    const existing = await prisma.ingredient.findFirst({
      where: { name: ingredient.name },
    });

    if (existing) {
      await prisma.ingredient.update({
        where: { id: existing.id },
        data: ingredient,
      });
    } else {
      await prisma.ingredient.create({ data: ingredient });
    }
  }

  console.log('Seed completed successfully.');
  console.log(`Admin account: admin@pizza.local / admin123 (id: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
