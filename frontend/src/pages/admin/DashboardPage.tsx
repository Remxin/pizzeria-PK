import { Button } from '../../components/common/Button'
import { Icon } from '../../components/common/Icon'
import { Card } from '../../components/common/Card'
import { OrderStatusBadge } from '../../components/features/OrderStatusBadge'
import { MOCK_DASHBOARD_STATS, MOCK_RECENT_ORDERS } from '../../constants/mockData'
import { formatPrice } from '../../utils/format'

export function DashboardPage() {
  return (
    <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mb-xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Panel Analityczny
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Przegląd dzisiejszej sprzedaży i zamówień
          </p>
        </div>
        <Button
          variant="secondary"
          leftIcon={<Icon name="download" className="text-sm" />}
          onClick={() => console.log('Export report')}
        >
          Eksportuj raport
        </Button>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-md mb-xl">
        {MOCK_DASHBOARD_STATS.map((stat) => (
          <Card key={stat.id} elevation="level-1" padding="md">
            <div className="flex items-start justify-between mb-sm">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                <Icon name={stat.icon} className="text-primary" />
              </div>
              <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed px-sm py-xs rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-xs">
              {stat.label}
            </p>
            <p className="font-headline-md text-headline-md text-on-surface">{stat.value}</p>
          </Card>
        ))}
      </section>

      {/* Charts placeholder + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Chart placeholder */}
        <Card elevation="level-1" padding="lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">
            Sprzedaż w czasie
          </h2>
          <div className="h-48 bg-surface-container-low rounded-lg flex items-center justify-center border border-dashed border-outline-variant">
            <div className="text-center">
              <Icon name="bar_chart" className="text-on-surface-variant text-4xl mb-sm" />
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Wykres sprzedaży — do implementacji
              </p>
            </div>
          </div>
        </Card>

        {/* Popular products placeholder */}
        <Card elevation="level-1" padding="lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">
            Najpopularniejsze pizze
          </h2>
          <div className="space-y-sm">
            {['Margherita', 'Pepperoni', 'Quattro Formaggi'].map((name, i) => (
              <div
                key={name}
                className="flex items-center justify-between p-sm bg-surface-container-low rounded-lg"
              >
                <div className="flex items-center gap-sm">
                  <span className="font-label-lg text-label-lg text-primary w-6">
                    {i + 1}
                  </span>
                  <span className="font-label-lg text-label-lg text-on-surface">{name}</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {42 - i * 8} zamówień
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent orders */}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {MOCK_RECENT_ORDERS.map((order, index) => (
                  <tr
                    key={order.id}
                    className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-container-lowest'}
                  >
                    <td className="py-md px-md font-label-lg text-label-lg text-primary">
                      {order.id}
                    </td>
                    <td className="py-md px-md font-body-md text-body-md text-on-surface">
                      {order.customer}
                    </td>
                    <td className="py-md px-md font-body-sm text-body-sm text-on-surface-variant hidden sm:table-cell">
                      {order.items}
                    </td>
                    <td className="py-md px-md font-label-lg text-label-lg text-on-surface">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-md px-md">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  )
}
