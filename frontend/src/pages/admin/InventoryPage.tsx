import { Button } from '../../components/common/Button'
import { Icon } from '../../components/common/Icon'
import { Badge } from '../../components/common/Badge'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { MOCK_INVENTORY } from '../../constants/mockData'
import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/format'

function StockBar({ stock }: { stock: number }) {
  const color =
    stock < 15 ? 'bg-error' : stock < 40 ? 'bg-secondary' : 'bg-tertiary'

  return (
    <div className="w-full bg-surface-container-high rounded-full h-2">
      <div
        className={cn('h-2 rounded-full transition-all', color)}
        style={{ width: `${Math.min(stock, 100)}%` }}
      />
    </div>
  )
}

export function InventoryPage() {
  return (
    <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-md mb-xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Inventory Management
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Monitor and manage artisan ingredients.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-md w-full lg:w-auto">
          <Input
            placeholder="Search ingredients..."
            leftIcon={<Icon name="search" />}
            className="w-full sm:w-64"
          />
          <Button
            leftIcon={<Icon name="add" className="text-sm" />}
            onClick={() => console.log('Add stock')}
          >
            Add Stock
          </Button>
        </div>
      </header>

      {/* Alerts */}
      <section className="mb-lg flex flex-col md:flex-row gap-md">
        <div className="bg-error-container text-on-error-container rounded-lg p-md flex-1 flex items-start gap-md border border-error/20">
          <Icon name="error" filled className="text-error mt-0.5" />
          <div className="flex-grow">
            <h3 className="font-label-lg text-label-lg font-bold mb-1">
              Low Stock Alert: Sourdough Starter
            </h3>
            <p className="font-body-sm text-body-sm opacity-90">
              Current level is below 10% capacity. Recommended to replenish immediately.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => console.log('Order')}>
            Order
          </Button>
        </div>
        <div className="bg-surface-container-highest text-on-surface rounded-lg p-md flex-1 flex items-start gap-md border border-outline-variant/50">
          <Icon name="info" className="text-secondary mt-0.5" />
          <div>
            <h3 className="font-label-lg text-label-lg font-bold mb-1">
              Incoming Delivery: San Marzano Tomatoes
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Expected delivery today at 14:00. (50 kg)
            </p>
          </div>
        </div>
      </section>

      {/* Mobile: Card view */}
      <div className="lg:hidden space-y-md mb-lg">
        {MOCK_INVENTORY.map((item) => (
          <Card key={item.id} elevation="level-1" padding="md">
            <div className="flex items-start gap-sm mb-sm">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                <Icon name={item.icon} className="text-base" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-label-lg text-label-lg text-on-surface">{item.name}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {item.category}
                </p>
              </div>
              <Badge variant={item.status === 'low' ? 'error' : 'success'}>
                {item.status === 'low' ? 'Low' : 'OK'}
              </Badge>
            </div>
            <StockBar stock={item.stock} />
            <div className="flex justify-between items-center mt-sm">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {item.stock} {item.unit}
              </span>
              <span className="font-label-lg text-label-lg text-on-surface">
                {item.unitPrice > 0 ? formatPrice(item.unitPrice) : '—'}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop: Table view */}
      <Card elevation="level-1" padding="none" className="hidden lg:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md font-semibold uppercase tracking-wider">
                  Ingredient
                </th>
                <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md font-semibold uppercase tracking-wider w-1/4">
                  Stock Level
                </th>
                <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md font-semibold uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md font-semibold uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {MOCK_INVENTORY.map((item, index) => (
                <tr
                  key={item.id}
                  className={cn(
                    'hover:bg-surface-container-lowest transition-colors',
                    index % 2 === 0 ? 'bg-surface' : 'bg-surface-container-lowest',
                  )}
                >
                  <td className="py-md px-md">
                    <div className="flex items-center gap-sm">
                      <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                        <Icon name={item.icon} className="text-base" />
                      </div>
                      <div>
                        <p className="font-label-lg text-label-lg text-on-surface">{item.name}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-md px-md">
                    <div className="space-y-xs">
                      <StockBar stock={item.stock} />
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {item.stock} {item.unit}
                      </span>
                    </div>
                  </td>
                  <td className="py-md px-md">
                    <Badge variant={item.status === 'low' ? 'error' : 'success'}>
                      {item.status === 'low' ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </td>
                  <td className="py-md px-md font-label-lg text-label-lg text-on-surface">
                    {item.unitPrice > 0 ? formatPrice(item.unitPrice) : '—'}
                  </td>
                  <td className="py-md px-md text-right">
                    <div className="flex justify-end gap-xs">
                      <button
                        type="button"
                        className="p-xs text-on-surface-variant hover:text-primary transition-colors"
                        aria-label="Edytuj"
                        onClick={() => console.log('Edit', item.id)}
                      >
                        <Icon name="edit" />
                      </button>
                      <button
                        type="button"
                        className="p-xs text-on-surface-variant hover:text-error transition-colors"
                        aria-label="Usuń"
                        onClick={() => console.log('Delete', item.id)}
                      >
                        <Icon name="delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
