import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Button } from '../../components/common/Button'
import { Icon } from '../../components/common/Icon'
import { Card } from '../../components/common/Card'
import { OrderStatusBadge } from '../../components/features/OrderStatusBadge'
import {
  fetchAllOrdersAsync,
  updateOrderStatusAsync,
} from '../../features/orders/ordersSlice'
import { formatPrice } from '../../utils/format'
import { toNumber } from '../../utils/decimal'
import { getNextOrderStatus, getOrderStatusLabel } from '../../utils/orderStatus'

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const { allOrders, loading, error, meta } = useAppSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchAllOrdersAsync({ limit: 20 }))
  }, [dispatch])

  const totalRevenue = allOrders.reduce(
    (sum, order) => sum + toNumber(order.totalPrice),
    0,
  )

  const activeOrders = allOrders.filter((order) => order.status !== 'COMPLETED').length

  const handleAdvanceStatus = (orderId: number, currentStatus: typeof allOrders[number]['status']) => {
    const nextStatus = getNextOrderStatus(currentStatus)

    if (nextStatus) {
      dispatch(updateOrderStatusAsync({ id: orderId, status: nextStatus }))
    }
  }

  return (
    <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mb-xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Panel Analityczny
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Przegląd sprzedaży i zamówień w czasie rzeczywistym
          </p>
        </div>
        <Button
          variant="secondary"
          leftIcon={<Icon name="refresh" className="text-sm" />}
          onClick={() => dispatch(fetchAllOrdersAsync({ limit: 20 }))}
        >
          Odśwież
        </Button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-md mb-xl">
        <Card elevation="level-1" padding="md">
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-xs">Zamówienia</p>
          <p className="font-headline-md text-headline-md text-on-surface">
            {meta?.total ?? allOrders.length}
          </p>
        </Card>
        <Card elevation="level-1" padding="md">
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-xs">Aktywne</p>
          <p className="font-headline-md text-headline-md text-on-surface">{activeOrders}</p>
        </Card>
        <Card elevation="level-1" padding="md">
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-xs">Przychód (lista)</p>
          <p className="font-headline-md text-headline-md text-on-surface">
            {formatPrice(totalRevenue)}
          </p>
        </Card>
        <Card elevation="level-1" padding="md">
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-xs">Status API</p>
          <p className="font-headline-md text-headline-md text-tertiary">Online</p>
        </Card>
      </section>

      {loading && (
        <p className="font-body-md text-body-md text-on-surface-variant mb-md">
          Ładowanie zamówień...
        </p>
      )}

      {error && (
        <p className="font-body-md text-body-md text-error mb-md">{error}</p>
      )}

      <section className="mt-xl">
        <div className="flex items-center justify-between mb-md">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Ostatnie zamówienia
          </h2>
          <span className="flex items-center gap-xs font-label-sm text-label-sm text-tertiary">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            Real-time
          </span>
        </div>
        <Card elevation="level-1" padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md uppercase tracking-wider">
                    ID
                  </th>
                  <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md uppercase tracking-wider">
                    Klient
                  </th>
                  <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md uppercase tracking-wider hidden sm:table-cell">
                    Pozycje
                  </th>
                  <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md uppercase tracking-wider">
                    Kwota
                  </th>
                  <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md uppercase tracking-wider">
                    Status
                  </th>
                  <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md uppercase tracking-wider">
                    Akcja
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {allOrders.map((order, index) => {
                  const nextStatus = getNextOrderStatus(order.status)

                  return (
                    <tr
                      key={order.id}
                      className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-container-lowest'}
                    >
                      <td className="py-md px-md font-label-lg text-label-lg text-primary">
                        #{order.id}
                      </td>
                      <td className="py-md px-md font-body-md text-body-md text-on-surface">
                        {order.user?.fullName ?? order.user?.email ?? order.customerPhone}
                      </td>
                      <td className="py-md px-md font-body-sm text-body-sm text-on-surface-variant hidden sm:table-cell">
                        {order.items?.length ?? 0}
                      </td>
                      <td className="py-md px-md font-label-lg text-label-lg text-on-surface">
                        {formatPrice(toNumber(order.totalPrice))}
                      </td>
                      <td className="py-md px-md">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-md px-md">
                        {nextStatus ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleAdvanceStatus(order.id, order.status)}
                          >
                            → {getOrderStatusLabel(nextStatus)}
                          </Button>
                        ) : (
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Zakończone
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  )
}
