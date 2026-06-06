export type CategoryType = 'PRODUCT' | 'INGREDIENT'

export interface Category {
  id: number
  name: string
  description?: string | null
  type: CategoryType
  displayOrder: number
}

export interface Product {
  id: number
  categoryId: number
  name: string
  description?: string | null
  basePrice: number | string
  imageUrl?: string | null
  isAvailable: boolean
  createdAt?: string
  updatedAt?: string
  category?: Category
}

export interface Ingredient {
  id: number
  categoryId: number
  name: string
  unitCost: number | string
  priceForClient: number | string
  stockQuantity: number
  alertThreshold: number
  unit: string
  imageUrl?: string | null
  isAvailable: boolean
  createdAt?: string
  updatedAt?: string
  category?: Category
}

export interface CustomPizzaIngredient {
  id?: number
  ingredientId: number
  quantity: number
  ingredient?: Ingredient
}

export interface CustomPizza {
  id: number
  userId: number
  name: string
  totalPrice: number | string
  imageUrl?: string | null
  createdAt?: string
  updatedAt?: string
  ingredients: CustomPizzaIngredient[]
}
