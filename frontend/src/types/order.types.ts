export type OrderStatus =
  | 'NEW'
  | 'IN_PREPARATION'
  | 'READY'
  | 'PICKED_UP'
  | 'COMPLETED'

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  totalPrice: number
  createdAt: string
}
