import type { CustomPizza, Product } from './product.types'
import type { User } from './user.types'

export type OrderStatus =
  | 'NEW'
  | 'IN_PREPARATION'
  | 'READY'
  | 'PICKED_UP'
  | 'COMPLETED'

export type DeliveryType = 'DELIVERY' | 'PICKUP'

export interface OrderItemIngredient {
  id: number
  orderItemId: number
  ingredientId: number
  quantity: number
  unitCost: number | string
  priceForClient: number | string
  ingredientName: string
}

export interface OrderItem {
  id: number
  orderId: number
  productId?: number | null
  customPizzaId?: number | null
  quantity: number
  unitPrice: number | string
  itemName: string
  product?: Product | null
  customPizza?: CustomPizza | null
  ingredients?: OrderItemIngredient[]
}

export interface Order {
  id: number
  userId?: number | null
  status: OrderStatus
  totalPrice: number | string
  deliveryType: DeliveryType
  deliveryAddress?: string | null
  customerPhone: string
  notes?: string | null
  estimatedTime?: number | null
  createdAt: string
  updatedAt?: string
  items?: OrderItem[]
  user?: Pick<User, 'id' | 'email' | 'fullName'> | null
}

export interface CreateOrderItemPayload {
  productId?: number
  customPizzaId?: number
  quantity: number
  ingredients?: Array<{ ingredientId: number; quantity: number }>
}

export interface CreateOrderPayload {
  deliveryType: DeliveryType
  deliveryAddress?: string
  customerPhone: string
  notes?: string
  items: CreateOrderItemPayload[]
}
