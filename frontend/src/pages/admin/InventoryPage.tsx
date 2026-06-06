import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Button } from '../../components/common/Button'
import { Icon } from '../../components/common/Icon'
import { Badge } from '../../components/common/Badge'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { Modal } from '../../components/common/Modal'
import { fetchIngredientsAsync, updateIngredientInList } from '../../features/ingredients/ingredientsSlice'
import {
  adjustStockAsync,
  fetchLowStockAlertsAsync,
} from '../../features/inventory/inventorySlice'
import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/format'
import { toNumber } from '../../utils/decimal'

function StockBar({ stock, threshold }: { stock: number; threshold: number }) {
  const percentage = threshold > 0 ? Math.min((stock / threshold) * 100, 100) : 100
  const color = stock <= threshold ? 'bg-error' : stock <= threshold * 2 ? 'bg-secondary' : 'bg-tertiary'

  return (
    <div className="w-full bg-surface-container-high rounded-full h-2">
      <div
        className={cn('h-2 rounded-full transition-all', color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export function InventoryPage() {
  const dispatch = useAppDispatch()
  const { items: ingredients, loading, error } = useAppSelector((state) => state.ingredients)
  const { alerts, loading: alertsLoading } = useAppSelector((state) => state.inventory)
  const [search, setSearch] = useState('')
  const [selectedIngredientId, setSelectedIngredientId] = useState<number | null>(null)
  const [adjustment, setAdjustment] = useState('')
  const [reason, setReason] = useState('')
  const [adjustError, setAdjustError] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchIngredientsAsync({ limit: 100 }))
    dispatch(fetchLowStockAlertsAsync())
  }, [dispatch])

  const filteredIngredients = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return ingredients
    }

    return ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(query),
    )
  }, [ingredients, search])

  const selectedIngredient = ingredients.find(
    (ingredient) => ingredient.id === selectedIngredientId,
  )

  const handleAdjustStock = async () => {
    if (!selectedIngredientId) {
      return
    }

    const value = Number(adjustment)

    if (Number.isNaN(value) || value === 0) {
      setAdjustError('Podaj niezerową wartość korekty')
      return
    }

    setAdjustError(null)

    const result = await dispatch(
      adjustStockAsync({
        ingredientId: selectedIngredientId,
        adjustment: value,
        reason: reason || undefined,
      }),
    )

    if (adjustStockAsync.fulfilled.match(result)) {
      dispatch(updateIngredientInList(result.payload))
      dispatch(fetchLowStockAlertsAsync())
      setSelectedIngredientId(null)
      setAdjustment('')
      setReason('')
    }
  }

  return (
    <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-md mb-xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Zarządzanie magazynem
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Monitoruj i koryguj stany składników
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-md w-full lg:w-auto">
          <Input
            placeholder="Szukaj składników..."
            leftIcon={<Icon name="search" />}
            className="w-full sm:w-64"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </header>

      {alerts.length > 0 && (
        <section className="mb-lg flex flex-col gap-md">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-error-container text-on-error-container rounded-lg p-md flex items-start gap-md border border-error/20"
            >
              <Icon name="error" filled className="text-error mt-0.5" />
              <div className="flex-grow">
                <h3 className="font-label-lg text-label-lg font-bold mb-1">
                  Niski stan: {alert.name}
                </h3>
                <p className="font-body-sm text-body-sm opacity-90">
                  Aktualnie {alert.stockQuantity} {alert.unit} (próg: {alert.alertThreshold})
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedIngredientId(alert.id)}
              >
                Korekta
              </Button>
            </div>
          ))}
        </section>
      )}

      {loading && (
        <p className="font-body-md text-body-md text-on-surface-variant mb-md">
          Ładowanie magazynu...
        </p>
      )}

      {error && (
        <p className="font-body-md text-body-md text-error mb-md">{error}</p>
      )}

      <div className="lg:hidden space-y-md mb-lg">
        {filteredIngredients.map((item) => {
          const isLow = item.stockQuantity <= item.alertThreshold

          return (
            <Card key={item.id} elevation="level-1" padding="md">
              <div className="flex items-start gap-sm mb-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                  <Icon name="inventory_2" className="text-base" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-label-lg text-label-lg text-on-surface">{item.name}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {item.category?.name}
                  </p>
                </div>
                <Badge variant={isLow ? 'error' : 'success'}>
                  {isLow ? 'Niski' : 'OK'}
                </Badge>
              </div>
              <StockBar stock={item.stockQuantity} threshold={item.alertThreshold} />
              <div className="flex justify-between items-center mt-sm">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {item.stockQuantity} {item.unit}
                </span>
                <Button size="sm" onClick={() => setSelectedIngredientId(item.id)}>
                  Korekta
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      <Card elevation="level-1" padding="none" className="hidden lg:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md font-semibold uppercase tracking-wider">
                  Składnik
                </th>
                <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md font-semibold uppercase tracking-wider w-1/4">
                  Stan
                </th>
                <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md font-semibold uppercase tracking-wider">
                  Koszt jednostkowy
                </th>
                <th className="font-label-sm text-label-sm text-on-surface-variant py-sm px-md font-semibold uppercase tracking-wider text-right">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {filteredIngredients.map((item, index) => {
                const isLow = item.stockQuantity <= item.alertThreshold

                return (
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
                          <Icon name="inventory_2" className="text-base" />
                        </div>
                        <div>
                          <p className="font-label-lg text-label-lg text-on-surface">{item.name}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {item.category?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-md px-md">
                      <div className="space-y-xs">
                        <StockBar
                          stock={item.stockQuantity}
                          threshold={item.alertThreshold}
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {item.stockQuantity} {item.unit}
                        </span>
                      </div>
                    </td>
                    <td className="py-md px-md">
                      <Badge variant={isLow ? 'error' : 'success'}>
                        {isLow ? 'Niski stan' : 'W magazynie'}
                      </Badge>
                    </td>
                    <td className="py-md px-md font-label-lg text-label-lg text-on-surface">
                      {formatPrice(toNumber(item.unitCost))}
                    </td>
                    <td className="py-md px-md text-right">
                      <Button size="sm" onClick={() => setSelectedIngredientId(item.id)}>
                        Korekta
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={selectedIngredientId !== null}
        onClose={() => {
          setSelectedIngredientId(null)
          setAdjustment('')
          setReason('')
          setAdjustError(null)
        }}
        title={`Korekta stanu: ${selectedIngredient?.name ?? ''}`}
      >
        <div className="space-y-md">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Aktualny stan: {selectedIngredient?.stockQuantity} {selectedIngredient?.unit}
          </p>
          <Input
            label="Korekta (+/-)"
            type="number"
            value={adjustment}
            onChange={(event) => setAdjustment(event.target.value)}
            helperText="Dodatnia wartość zwiększa stan, ujemna zmniejsza"
          />
          <Input
            label="Powód (opcjonalnie)"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          {adjustError && (
            <p className="font-body-sm text-body-sm text-error">{adjustError}</p>
          )}
          <Button fullWidth onClick={handleAdjustStock} disabled={alertsLoading}>
            Zapisz korektę
          </Button>
        </div>
      </Modal>
    </div>
  )
}
