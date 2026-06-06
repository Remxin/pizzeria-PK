import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Button } from '../../components/common/Button'
import { Icon } from '../../components/common/Icon'
import { addToCart } from '../../features/cart/cartSlice'
import { saveCustomPizzaAsync } from '../../features/customPizzas/customPizzasSlice'
import { fetchIngredientsAsync } from '../../features/ingredients/ingredientsSlice'
import { cn } from '../../utils/cn'
import { toNumber } from '../../utils/decimal'
import { formatPrice } from '../../utils/format'

const BASE_PRICE = 32
const FALLBACK_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA0EMNjCbIO4l1U5UhVlcfBuk5NTLeWzL-lo-d2tTs_nBnDvC-LFOM3-G2vhUjR60GPJbfFUzuQZw6orby_SnlLQG-kwAK7a3PPM4xp6VkCJegmPATbPBUrez3JJXNLDWOEg_Ny0xPTvTTd4o__DjjtjX5vni4DMEaiHHSfCQTYFXYOkxx6cZcK2wmYlt5_nij6MdV306jwvuoqu1PfIal18o2mrv1u3rLCrxLLbBPwi7hkTsORRj7iJNqsbbfqrtit3W15fM1MT6K5'

export function PizzaCreatorPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items: ingredients, loading, error } = useAppSelector((state) => state.ingredients)
  const { loading: saving, error: saveError } = useAppSelector((state) => state.customPizzas)
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [selectedIngredients, setSelectedIngredients] = useState<
    Record<number, { quantity: number; name: string; price: number }>
  >({})
  const [actionError, setActionError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchIngredientsAsync({ isAvailable: true, limit: 100 }))
  }, [dispatch])

  const categories = useMemo(() => {
    const map = new Map<number, string>()

    ingredients.forEach((ingredient) => {
      if (ingredient.category) {
        map.set(ingredient.category.id, ingredient.category.name)
      }
    })

    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [ingredients])

  useEffect(() => {
    if (categories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(categories[0].id)
    }
  }, [categories, activeCategoryId])

  const filteredIngredients = useMemo(() => {
    if (!activeCategoryId) {
      return ingredients
    }

    return ingredients.filter((ingredient) => ingredient.categoryId === activeCategoryId)
  }, [ingredients, activeCategoryId])

  const selectedList = Object.entries(selectedIngredients)

  const totalPrice =
    BASE_PRICE +
    selectedList.reduce((sum, [, ingredient]) => sum + ingredient.price * ingredient.quantity, 0)

  const toggleIngredient = (ingredientId: number, name: string, price: number) => {
    setSelectedIngredients((prev) => {
      if (prev[ingredientId]) {
        const next = { ...prev }
        delete next[ingredientId]
        return next
      }

      return {
        ...prev,
        [ingredientId]: { quantity: 1, name, price },
      }
    })
  }

  const buildCartItem = () => {
    const ingredientSelections = selectedList.map(([ingredientId, ingredient]) => ({
      ingredientId: Number(ingredientId),
      quantity: ingredient.quantity,
      name: ingredient.name,
      price: ingredient.price,
    }))

    return {
      id: `custom-${Date.now()}`,
      type: 'custom' as const,
      name: 'Moja Pizza',
      price: totalPrice,
      quantity: 1,
      imageUrl: FALLBACK_IMAGE,
      ingredients: ingredientSelections,
    }
  }

  const handleAddToCart = () => {
    setActionError(null)

    if (selectedList.length === 0) {
      setActionError('Wybierz co najmniej jeden składnik')
      return
    }

    dispatch(addToCart(buildCartItem()))
    setSuccessMessage('Dodano do koszyka')
    navigate('/cart')
  }

  const handleSave = async () => {
    setActionError(null)
    setSuccessMessage(null)

    if (selectedList.length === 0) {
      setActionError('Wybierz co najmniej jeden składnik')
      return
    }

    const result = await dispatch(
      saveCustomPizzaAsync({
        name: 'Moja Pizza',
        ingredients: selectedList.map(([ingredientId, ingredient]) => ({
          ingredientId: Number(ingredientId),
          quantity: ingredient.quantity,
        })),
      }),
    )

    if (saveCustomPizzaAsync.fulfilled.match(result)) {
      setSuccessMessage('Kompozycja została zapisana')
    }
  }

  return (
    <main className="flex-grow container mx-auto px-margin-mobile lg:px-lg py-lg flex flex-col lg:flex-row gap-xl max-w-container-max">
      <section className="flex-1 flex flex-col items-center justify-center relative min-h-[360px] lg:min-h-[618px]">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-lg text-center hidden lg:block">
          Stwórz własną kompozycję
        </h1>
        <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full bg-surface-container-low pizza-stage flex items-center justify-center overflow-hidden border-8 border-secondary-fixed-dim z-10">
          <img
            alt="Pizza Crust base"
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply"
            src={FALLBACK_IMAGE}
          />
          {selectedList.length === 0 && (
            <p className="text-on-surface-variant font-label-lg text-label-lg opacity-50 z-0 text-center px-4">
              Wybierz składniki z listy
            </p>
          )}
        </div>
        <div className="mt-xl text-center hidden lg:block">
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Baza: Ciasto na zakwasie, sos pomidorowy
          </p>
        </div>
      </section>

      <section className="w-full lg:w-1/3 flex flex-col bg-surface-container-lowest rounded-xl shadow-level-1 p-lg border border-surface-variant z-20">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md lg:hidden">
          Stwórz własną kompozycję
        </h2>

        {loading && (
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
            Ładowanie składników...
          </p>
        )}

        {(error || actionError || saveError) && (
          <p className="font-body-sm text-body-sm text-error mb-md">
            {actionError ?? saveError ?? error}
          </p>
        )}

        {successMessage && (
          <p className="font-body-sm text-body-sm text-tertiary mb-md">{successMessage}</p>
        )}

        <div className="flex gap-sm mb-md border-b border-surface-variant pb-2 overflow-x-auto hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              className={cn(
                'font-label-lg text-label-lg whitespace-nowrap px-2 pb-1 transition-colors',
                activeCategoryId === category.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary',
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex-grow overflow-y-auto pr-sm mb-lg space-y-md h-64 lg:h-auto">
          <div className="grid grid-cols-2 gap-sm">
            {filteredIngredients.map((ingredient) => {
              const isSelected = Boolean(selectedIngredients[ingredient.id])
              const price = toNumber(ingredient.priceForClient)

              return (
                <button
                  key={ingredient.id}
                  type="button"
                  onClick={() => toggleIngredient(ingredient.id, ingredient.name, price)}
                  className={cn(
                    'ingredient-chip bg-surface-container flex items-center gap-2 p-2 rounded-full cursor-pointer border transition-colors text-left',
                    isSelected
                      ? 'border-2 border-primary'
                      : 'border-outline-variant hover:bg-surface-container-high',
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center overflow-hidden shrink-0">
                    {ingredient.imageUrl ? (
                      <img
                        src={ingredient.imageUrl}
                        alt={ingredient.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon name="restaurant" className="text-secondary text-sm" />
                    )}
                  </div>
                  <div className="flex flex-col flex-grow min-w-0">
                    <span className="font-label-sm text-label-sm text-on-surface truncate">
                      {ingredient.name}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[10px]">
                      +{formatPrice(price)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-auto pt-md border-t border-surface-variant">
          <div className="flex justify-between items-center mb-md">
            <span className="font-body-lg text-body-lg text-on-surface-variant">Suma:</span>
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className="flex flex-col gap-sm">
            <Button
              fullWidth
              leftIcon={<Icon name="shopping_cart" className="text-sm" />}
              onClick={handleAddToCart}
            >
              Dodaj do koszyka
            </Button>
            <Button
              variant="secondary"
              fullWidth
              leftIcon={<Icon name="favorite" className="text-sm" />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Zapisywanie...' : 'Zapisz kompozycję'}
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
