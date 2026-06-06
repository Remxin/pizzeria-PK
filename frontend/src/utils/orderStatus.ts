import type { OrderStatus } from '../types/order.types'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: 'Nowe',
  IN_PREPARATION: 'W przygotowaniu',
  READY: 'Gotowe',
  PICKED_UP: 'Odebrane',
  COMPLETED: 'Zakończone',
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'NEW',
  'IN_PREPARATION',
  'READY',
  'PICKED_UP',
  'COMPLETED',
]

export function getNextOrderStatus(status: OrderStatus): OrderStatus | null {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(status)
  return currentIndex >= 0 && currentIndex < ORDER_STATUS_FLOW.length - 1
    ? ORDER_STATUS_FLOW[currentIndex + 1]
    : null
}

export function getOrderStatusLabel(status: OrderStatus | string): string {
  return ORDER_STATUS_LABELS[status as OrderStatus] ?? status
}
