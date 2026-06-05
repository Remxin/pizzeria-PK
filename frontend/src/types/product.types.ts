export interface Product {
  id: string
  name: string
  basePrice: number
  imageUrl?: string
}

export interface Ingredient {
  id: string
  name: string
  priceForClient: number
  imageUrl?: string
}
