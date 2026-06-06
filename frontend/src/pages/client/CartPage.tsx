import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Button } from '../../components/common/Button'
import { Icon } from '../../components/common/Icon'
import { Input } from '../../components/common/Input'
import { CartItem } from '../../components/features/CartItem'
import { BRAND_NAME } from '../../constants/mockData'
import {
  buildOrderItemsFromCart,
  clearOrderError,
  placeOrderAsync,
  removeFromCart,
  selectCartTotal,
  updateCartQuantity,
} from '../../features/cart/cartSlice'
import { joinOrderRoom } from '../../services/socket.service'
import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/format'
import type { DeliveryType } from '../../types/order.types'

export function CartPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items, placingOrder, orderError, lastOrder } = useAppSelector((state) => state.cart)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const subtotal = useAppSelector(selectCartTotal)

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address ?? '')
  const [customerPhone, setCustomerPhone] = useState(user?.phone ?? '')
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.address) {
      setDeliveryAddress(user.address)
    }

    if (user?.phone) {
      setCustomerPhone(user.phone)
    }
  }, [user])

  useEffect(() => {
    if (lastOrder) {
      joinOrderRoom(lastOrder.id)
      navigate(`/orders/${lastOrder.id}`)
    }
  }, [lastOrder, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearOrderError())
    }
  }, [dispatch])

  const deliveryFee = deliveryType === 'delivery' ? 8 : 0
  const total = subtotal + deliveryFee

  const handlePlaceOrder = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)

    if (items.length === 0) {
      setFormError('Koszyk jest pusty')
      return
    }

    if (!customerPhone.trim()) {
      setFormError('Podaj numer telefonu')
      return
    }

    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Podaj adres dostawy')
      return
    }

    try {
      const orderItems = await buildOrderItemsFromCart(items, isAuthenticated)

      await dispatch(
        placeOrderAsync({
          deliveryType: (deliveryType === 'delivery' ? 'DELIVERY' : 'PICKUP') as DeliveryType,
          deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
          customerPhone,
          notes: notes || undefined,
          items: orderItems,
        }),
      )
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Nie udało się złożyć zamówienia')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-surface shadow-sm flex items-center justify-center p-md z-50 relative md:hidden">
        <span className="font-headline-md text-headline-md font-bold text-primary">
          {BRAND_NAME}
        </span>
      </header>

      <main className="flex-grow w-full max-w-container-max mx-auto p-margin-mobile md:p-lg grid grid-cols-1 lg:grid-cols-12 gap-lg mt-md pb-[100px] lg:pb-md">
        <div className="lg:col-span-7 flex flex-col gap-lg">
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg">
            Kasa
          </h1>

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

          {deliveryType === 'delivery' && (
            <section className="bg-surface-container-lowest rounded-xl p-lg shadow-level-1 border border-surface-container-highest">
              <h2 className="font-headline-sm text-headline-sm flex items-center gap-sm mb-md">
                <Icon name="location_on" className="text-primary" />
                Szczegóły dostawy
              </h2>
              <div className="grid grid-cols-1 gap-md">
                <Input
                  label="Adres dostawy"
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                />
                <Input
                  label="Telefon"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  type="tel"
                />
                <Input
                  label="Uwagi (opcjonalnie)"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </section>
          )}

          {deliveryType === 'pickup' && (
            <section className="bg-surface-container-lowest rounded-xl p-lg shadow-level-1 border border-surface-container-highest">
              <Input
                label="Telefon"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                type="tel"
              />
            </section>
          )}

          <section className="flex flex-col gap-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Twoje zamówienie ({items.length})
            </h2>
            {items.length === 0 && (
              <p className="font-body-md text-body-md text-on-surface-variant">
                Koszyk jest pusty. Dodaj produkty z menu.
              </p>
            )}
            {items.map((item) => (
              <CartItem
                key={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                image={item.imageUrl}
                onIncrease={() =>
                  dispatch(updateCartQuantity({ id: item.id, quantity: item.quantity + 1 }))
                }
                onDecrease={() =>
                  dispatch(
                    updateCartQuantity({
                      id: item.id,
                      quantity: Math.max(1, item.quantity - 1),
                    }),
                  )
                }
                onRemove={() => dispatch(removeFromCart(item.id))}
              />
            ))}
          </section>
        </div>

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

            {(formError || orderError) && (
              <p className="font-body-sm text-body-sm text-error mb-md">{formError ?? orderError}</p>
            )}

            <Button
              fullWidth
              size="lg"
              disabled={placingOrder || items.length === 0}
              onClick={handlePlaceOrder}
            >
              {placingOrder ? 'Składanie zamówienia...' : 'Złóż zamówienie'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
