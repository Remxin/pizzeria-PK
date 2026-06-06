export type CartItemType = 'product' | 'custom'

export interface CartIngredientSelection {
  ingredientId: number
  quantity: number
  name: string
  price: number
}

export interface CartItem {
  id: string
  type: CartItemType
  name: string
  price: number
  quantity: number
  imageUrl?: string
  productId?: number
  customPizzaId?: number
  ingredients?: CartIngredientSelection[]
}
