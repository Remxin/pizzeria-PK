import { Badge } from '../common/Badge'

type OrderStatus = 'Nowe' | 'W przygotowaniu' | 'Gotowe' | 'Odebrane' | 'Zakończone'

interface OrderStatusBadgeProps {
  status: OrderStatus | string
}

const statusVariantMap: Record<string, 'primary' | 'warning' | 'success' | 'default' | 'secondary'> = {
  Nowe: 'primary',
  'W przygotowaniu': 'warning',
  Gotowe: 'success',
  Odebrane: 'secondary',
  Zakończone: 'default',
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variant = statusVariantMap[status] ?? 'default'

  return <Badge variant={variant}>{status}</Badge>
}
