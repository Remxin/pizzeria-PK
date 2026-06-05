import { useState } from 'react'
import { Button } from '../../components/common/Button'
import { Icon } from '../../components/common/Icon'
import { Input } from '../../components/common/Input'
import { CartItem } from '../../components/features/CartItem'
import { BRAND_NAME, MOCK_CART_ITEMS } from '../../constants/mockData'
import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/format'

type DeliveryType = 'delivery' | 'pickup'

export function CartPage() {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery')
  const [items] = useState([...MOCK_CART_ITEMS])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = deliveryType === 'delivery' ? 8 : 0
  const total = subtotal + deliveryFee

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-surface shadow-sm flex items-center justify-center p-md z-50 relative md:hidden">
        <span className="font-headline-md text-headline-md font-bold text-primary">
          {BRAND_NAME}
        </span>
      </header>

      <main className="flex-grow w-full max-w-container-max mx-auto p-margin-mobile md:p-lg grid grid-cols-1 lg:grid-cols-12 gap-lg mt-md pb-[100px] lg:pb-md">
        {/* Left: Checkout Details */}
        <div className="lg:col-span-7 flex flex-col gap-lg">
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg">
            Kasa
          </h1>

          {/* Delivery type toggle */}
          <section className="bg-surface-container-lowest rounded-xl p-lg shadow-level-1 border border-surface-container-highest">
            <h2 className="font-headline-sm text-headline-sm flex items-center gap-sm mb-md">
              <Icon name="local_shipping" className="text-primary" />
              Sposób odbioru
            </h2>
            <div className="flex gap-sm">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={cn(
                  'flex-1 py-sm px-md rounded-lg font-label-lg text-label-lg border-2 transition-colors',
                  deliveryType === 'delivery'
                    ? 'border-primary bg-primary-container text-on-primary-container'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary',
                )}
              >
                Dostawa
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={cn(
                  'flex-1 py-sm px-md rounded-lg font-label-lg text-label-lg border-2 transition-colors',
                  deliveryType === 'pickup'
                    ? 'border-primary bg-primary-container text-on-primary-container'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary',
                )}
              >
                Odbiór osobisty
              </button>
            </div>
          </section>

          {/* Delivery form */}
          {deliveryType === 'delivery' && (
            <section className="bg-surface-container-lowest rounded-xl p-lg shadow-level-1 border border-surface-container-highest">
              <h2 className="font-headline-sm text-headline-sm flex items-center gap-sm mb-md">
                <Icon name="location_on" className="text-primary" />
                Szczegóły dostawy
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-md" onSubmit={(e) => e.preventDefault()}>
                <div className="col-span-1 md:col-span-2">
                  <Input label="Imię i nazwisko" defaultValue="Jan Kowalski" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Input label="Ulica i numer" defaultValue="ul. Piekarska 14/2" />
                </div>
                <Input label="Miasto" defaultValue="Kraków" />
                <Input label="Kod pocztowy" defaultValue="31-001" />
                <div className="col-span-1 md:col-span-2">
                  <Input label="Telefon" defaultValue="+48 600 123 456" type="tel" />
                </div>
              </form>
            </section>
          )}

          {/* Cart items */}
          <section className="flex flex-col gap-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Twoje zamówienie ({items.length})
            </h2>
            {items.map((item) => (
              <CartItem
                key={item.id}
                name={item.name}
                size={item.size}
                price={item.price}
                quantity={item.quantity}
                image={item.image}
                onIncrease={() => console.log('Increase', item.id)}
                onDecrease={() => console.log('Decrease', item.id)}
                onRemove={() => console.log('Remove', item.id)}
              />
            ))}
          </section>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-lg bg-surface-container-lowest rounded-xl p-lg shadow-level-1 border border-surface-container-highest">
            <h2 className="font-headline-sm text-headline-sm mb-md">Podsumowanie</h2>

            <div className="space-y-sm mb-md">
              <div className="flex justify-between font-body-md text-body-md">
                <span className="text-on-surface-variant">Produkty</span>
                <span className="text-on-surface">{formatPrice(subtotal)}</span>
              </div>
              {deliveryType === 'delivery' && (
                <div className="flex justify-between font-body-md text-body-md">
                  <span className="text-on-surface-variant">Dostawa</span>
                  <span className="text-on-surface">{formatPrice(deliveryFee)}</span>
                </div>
              )}
              <div className="border-t border-outline-variant pt-sm flex justify-between">
                <span className="font-label-lg text-label-lg text-on-surface">Razem</span>
                <span className="font-headline-md text-headline-md text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="bg-tertiary-fixed/30 rounded-lg p-md mb-md flex items-center gap-sm">
              <Icon name="schedule" className="text-tertiary" />
              <div>
                <p className="font-label-lg text-label-lg text-on-surface">
                  Szacowany czas: 35–45 min
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Zamówienie zostanie przygotowane na żywo
                </p>
              </div>
            </div>

            <Button fullWidth size="lg" onClick={() => console.log('Place order')}>
              Złóż zamówienie
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
