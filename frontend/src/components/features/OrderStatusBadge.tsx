import { Badge } from '../common/Badge'
import type { OrderStatus } from '../../types/order.types'
import { getOrderStatusLabel } from '../../utils/orderStatus'

interface OrderStatusBadgeProps {
  status: OrderStatus | string
}

const statusVariantMap: Record<
  OrderStatus,
  'primary' | 'warning' | 'success' | 'default' | 'secondary'
> = {
  NEW: 'primary',
  IN_PREPARATION: 'warning',
  READY: 'success',
  PICKED_UP: 'secondary',
  COMPLETED: 'default',
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const normalizedStatus = status as OrderStatus
  const variant = statusVariantMap[normalizedStatus] ?? 'default'
  const label = getOrderStatusLabel(status)

  return <Badge variant={variant}>{label}</Badge>
}
