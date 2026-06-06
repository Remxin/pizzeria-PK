import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { OrderStatusBadge } from '../../components/features/OrderStatusBadge'
import {
  fetchOrderByIdAsync,
  updateOrderInLists,
} from '../../features/orders/ordersSlice'
import { connectSocket, getSocket, joinOrderRoom } from '../../services/socket.service'
import { formatPrice } from '../../utils/format'
import { toNumber } from '../../utils/decimal'
import { getOrderStatusLabel } from '../../utils/orderStatus'
import type { Order, OrderStatus } from '../../types/order.types'

interface OrderStatusChangedPayload {
  orderId: number
  status: OrderStatus
  order: Order
}

export function OrderTrackingPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { currentOrder, loading, error } = useAppSelector((state) => state.orders)
  const orderId = Number(id)

  useEffect(() => {
    if (!Number.isNaN(orderId)) {
      dispatch(fetchOrderByIdAsync(orderId))
      connectSocket()
      joinOrderRoom(orderId)
    }
  }, [dispatch, orderId])

  useEffect(() => {
    const socket = getSocket()

    const handleStatusChanged = (payload: OrderStatusChangedPayload) => {
      if (payload.orderId === orderId) {
        dispatch(updateOrderInLists(payload.order))
      }
    }

    socket.on('order:statusChanged', handleStatusChanged)

    return () => {
      socket.off('order:statusChanged', handleStatusChanged)
    }
  }, [dispatch, orderId])

  if (loading && !currentOrder) {
    return (
      <div className="max-w-container-max mx-auto p-lg text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Ładowanie zamówienia...
        </p>
      </div>
    )
  }

  if (error || !currentOrder) {
    return (
      <div className="max-w-container-max mx-auto p-lg text-center space-y-md">
        <p className="font-body-md text-body-md text-error">
          {error ?? 'Nie znaleziono zamówienia'}
        </p>
        <Link to="/menu">
          <Button>Wróć do menu</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto p-margin-mobile md:p-lg space-y-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Zamówienie #{currentOrder.id}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Status aktualizowany na żywo
          </p>
        </div>
        <OrderStatusBadge status={currentOrder.status} />
      </div>

      <Card elevation="level-1" padding="lg" className="space-y-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Status</p>
            <p className="font-label-lg text-label-lg text-on-surface">
              {getOrderStatusLabel(currentOrder.status)}
            </p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Szacowany czas</p>
            <p className="font-label-lg text-label-lg text-on-surface">
              {currentOrder.estimatedTime
                ? `${currentOrder.estimatedTime} min`
                : 'Brak danych'}
            </p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Sposób odbioru</p>
            <p className="font-label-lg text-label-lg text-on-surface">
              {currentOrder.deliveryType === 'DELIVERY' ? 'Dostawa' : 'Odbiór osobisty'}
            </p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Kwota</p>
            <p className="font-headline-sm text-headline-sm text-primary">
              {formatPrice(toNumber(currentOrder.totalPrice))}
            </p>
          </div>
        </div>

        {currentOrder.deliveryAddress && (
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Adres dostawy</p>
            <p className="font-body-md text-body-md text-on-surface">
              {currentOrder.deliveryAddress}
            </p>
          </div>
        )}

        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-sm">Pozycje</p>
          <div className="space-y-sm">
            {currentOrder.items?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-sm bg-surface-container-low rounded-lg"
              >
                <span className="font-label-lg text-label-lg text-on-surface">
                  {item.itemName} x{item.quantity}
                </span>
                <span className="font-label-lg text-label-lg text-on-surface">
                  {formatPrice(toNumber(item.unitPrice) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Link to="/menu">
        <Button variant="secondary">Wróć do menu</Button>
      </Link>
    </div>
  )
}
