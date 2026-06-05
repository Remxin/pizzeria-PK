export const BRAND_NAME = 'Sourdough & Stone'

export const MENU_CATEGORIES = [
  { id: 'pizza', label: 'Pizze' },
  { id: 'drinks', label: 'Napoje' },
  { id: 'starters', label: 'Przystawki' },
  { id: 'offers', label: 'Oferty' },
] as const

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Margherita',
    price: 32,
    description:
      'Sos pomidorowy San Marzano, świeża mozzarella fior di latte, bazylia, oliwa extra virgin.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB-3-FDSobu2zrPKPsE9scgy4CwmdmrpWgjr4QCvcf8w3g7F6HN-BKbCnmZP03hfMTrM3JvWv2L7zMWkXG6YG7ge1PAAWHt5aTULCsXnIYTGpHYLkV0gnfFprZ_4tn6SqdTZ1IM0L4pCvZ-b65H2_dFFnAmCYymFxhhlC8ickBrOQvF5tl9KlfsTJpZmOHfuERMLOSOj74f1A0YvKGurUWTE9Yv04PBELNRZFTrWSiQAogHKKr6dtivHn1J8WgZzTTi5Hz3mYLS4KnL',
    category: 'pizza',
    vegetarian: true,
  },
  {
    id: '2',
    name: 'Pepperoni',
    price: 38,
    description: 'Sos pomidorowy, mozzarella, podwójne rzemieślnicze pepperoni, płatki chilli.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoparmIdw8-kfrrqEDmVidI6keQDu5jrowC2UO-WSYh_ZlLY7gRSK8TM2EB-AU_wyz0Irwn-LMkPvaabLMZu_ZMaA7N4WNW5A5N7ojudPx3NTWoX4nk7saZknVlHJrXx5LGwNVwY2Td9gantNrGiqtHeuBGq7LVR5NwFHoNLtqzGsnDyypUPgI9l7YKaKtBkrJsm08jBEJRDzSTpP34CFS3wRqjfKfUb06RvQPpM5zr4ZQ2n1lBagOLaZua3J9SjOZZhoRqb7317HG',
    category: 'pizza',
    vegetarian: false,
  },
  {
    id: '3',
    name: 'Quattro Formaggi',
    price: 42,
    description: 'Biały sos, mozzarella, gorgonzola, parmezan, provolone, czarny pieprz.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVEAgWJ2ZJP0s-a8rCZPlp7ubmfdPrZaONyys3EbFa6i-3H3Pdcd_tl9Bn_SdzrGk5_MMZqOA6RTsV_Lh2f-SIQwGDiGrdvOisNJuIoLx4YTCYyTbdoh00C8Kd3DG1tDJhfizNir84tahmEwXgY9Vfde4j8lI8RbtaI9C3zARTn49reI7NFy6YwOZixqqaXZ6RvtIDwahrz19BjS-cJ7U-8n1W36_TfsIuf1PXXyPLysGu-6Xoj5YqnXJ8jsdH-uTY78x7TGk_ELCf',
    category: 'pizza',
    vegetarian: true,
  },
] as const

export const MOCK_INGREDIENTS = [
  {
    id: 'mozzarella',
    name: 'Mozzarella',
    price: 4,
    category: 'cheese',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmOFbscxyoQnbBOKeKu1zf1R2Bqv_KINYzpciFBuyEL5M-NH9bQG7Z6tpj5gSR6KUT0LyZo1L8PQoMJGTLf0u-cBSg5YhHH0D7UOwg1A5Fu__doGbVtC6NrD7Uz20m1lTeugbFM0GU9MR1Old929412F5-9R72BBFNKYrImfrAzxiH_2tI9XIwO-7UkAXLlwI_yXlU_Y3Z3bOCCLl2hHQkrW_wEN5wTG3IqmHxGpLPIVpedOosE2-mZydU62ke6aspg3K6vlXeOf5j',
  },
  {
    id: 'gorgonzola',
    name: 'Gorgonzola',
    price: 6,
    category: 'cheese',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5Efw5JmDo_7suAXP0XpN78lP6Foa65SviJyelrr2IEHf6Bnv3ML-oV0M2TOC-EcvtksphICzaYfEXQSdxIDeo4AP5bVEiT-KB-coKuPGO_wBBQDAUZi00YykSkHGmp80EahC0l1rVJ7mTEBXZo73sgz9OKtfSkgsxbsm2r8pCfJfxvw1nxb_pTvnr7sKw7OSpOYJVONqalTCM3c1oXWUQtuYiiRwjl1avO_Z0Ub3iFg1jFK1reI38mDncNDkySGQpNBSDI4280Ssi',
  },
  {
    id: 'provolone',
    name: 'Provolone',
    price: 5,
    category: 'cheese',
    icon: 'water_drop',
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    price: 5,
    category: 'meat',
    icon: 'local_pizza',
  },
  {
    id: 'basil',
    name: 'Bazylia',
    price: 2,
    category: 'vegetables',
    icon: 'eco',
  },
] as const

export const INGREDIENT_CATEGORIES = [
  { id: 'cheese', label: 'Sery' },
  { id: 'meat', label: 'Mięsa' },
  { id: 'vegetables', label: 'Warzywa' },
] as const

export const MOCK_CART_ITEMS = [
  {
    id: 'cart-1',
    name: 'Margherita',
    size: 'Duża (32 cm)',
    price: 32,
    quantity: 1,
    image: MOCK_PRODUCTS[0].image,
  },
  {
    id: 'cart-2',
    name: 'Własna kompozycja',
    size: 'Średnia (28 cm)',
    price: 45,
    quantity: 1,
    image: MOCK_PRODUCTS[1].image,
  },
] as const

export const MOCK_INVENTORY = [
  {
    id: '1',
    name: "Caputo '00' Flour",
    category: 'Base Dough',
    stock: 85,
    unit: 'kg',
    unitPrice: 12.5,
    status: 'ok' as const,
    icon: 'egg_alt',
  },
  {
    id: '2',
    name: 'San Marzano Tomatoes',
    category: 'Sauce',
    stock: 45,
    unit: 'kg',
    unitPrice: 18.0,
    status: 'ok' as const,
    icon: 'nutrition',
  },
  {
    id: '3',
    name: 'Sourdough Starter',
    category: 'Fermentation',
    stock: 8,
    unit: '%',
    unitPrice: 0,
    status: 'low' as const,
    icon: 'bakery_dining',
  },
  {
    id: '4',
    name: 'Fresh Mozzarella',
    category: 'Cheese',
    stock: 22,
    unit: 'kg',
    unitPrice: 32.0,
    status: 'ok' as const,
    icon: 'water_drop',
  },
] as const

export const MOCK_DASHBOARD_STATS = [
  { id: 'revenue', label: 'Przychód dzisiaj', value: '4 280 zł', change: '+12%', icon: 'payments' },
  { id: 'orders', label: 'Aktywne zamówienia', value: '18', change: '+3', icon: 'receipt_long' },
  { id: 'avg', label: 'Średnia wartość', value: '68 zł', change: '+5%', icon: 'trending_up' },
  { id: 'margin', label: 'Marża brutto', value: '62%', change: '-2%', icon: 'pie_chart' },
] as const

export const MOCK_RECENT_ORDERS = [
  { id: '#1042', customer: 'Anna K.', items: 2, total: 74, status: 'W przygotowaniu' },
  { id: '#1041', customer: 'Marek W.', items: 1, total: 38, status: 'Nowe' },
  { id: '#1040', customer: 'Julia S.', items: 3, total: 112, status: 'Gotowe' },
] as const
