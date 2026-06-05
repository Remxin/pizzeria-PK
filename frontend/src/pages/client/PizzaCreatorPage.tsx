import { useState } from 'react'
import { Button } from '../../components/common/Button'
import { Icon } from '../../components/common/Icon'
import {
  INGREDIENT_CATEGORIES,
  MOCK_INGREDIENTS,
} from '../../constants/mockData'
import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/format'

const BASE_PRICE = 32

export function PizzaCreatorPage() {
  const [activeCategory, setActiveCategory] = useState('cheese')
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])

  const filteredIngredients = MOCK_INGREDIENTS.filter(
    (i) => i.category === activeCategory,
  )

  const totalPrice =
    BASE_PRICE +
    MOCK_INGREDIENTS.filter((i) => selectedIngredients.includes(i.id)).reduce(
      (sum, i) => sum + i.price,
      0,
    )

  const toggleIngredient = (id: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  return (
    <main className="flex-grow container mx-auto px-margin-mobile lg:px-lg py-lg flex flex-col lg:flex-row gap-xl max-w-container-max">
      {/* Pizza Stage */}
      <section className="flex-1 flex flex-col items-center justify-center relative min-h-[360px] lg:min-h-[618px]">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-lg text-center hidden lg:block">
          Stwórz własną kompozycję
        </h1>
        <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full bg-surface-container-low pizza-stage flex items-center justify-center overflow-hidden border-8 border-secondary-fixed-dim z-10">
          <img
            alt="Pizza Crust base"
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0EMNjCbIO4l1U5UhVlcfBuk5NTLeWzL-lo-d2tTs_nBnDvC-LFOM3-G2vhUjR60GPJbfFUzuQZw6orby_SnlLQG-kwAK7a3PPM4xp6VkCJegmPATbPBUrez3JJXNLDWOEg_Ny0xPTvTTd4o__DjjtjX5vni4DMEaiHHSfCQTYFXYOkxx6cZcK2wmYlt5_nij6MdV306jwvuoqu1PfIal18o2mrv1u3rLCrxLLbBPwi7hkTsORRj7iJNqsbbfqrtit3W15fM1MT6K5"
          />
          {selectedIngredients.length === 0 && (
            <p className="text-on-surface-variant font-label-lg text-label-lg opacity-50 z-0 text-center px-4">
              Przeciągnij składniki tutaj
            </p>
          )}
        </div>
        <div className="mt-xl text-center hidden lg:block">
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Baza: Ciasto na zakwasie, sos pomidorowy
          </p>
        </div>
      </section>

      {/* Builder Controls */}
      <section className="w-full lg:w-1/3 flex flex-col bg-surface-container-lowest rounded-xl shadow-level-1 p-lg border border-surface-variant z-20">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md lg:hidden">
          Stwórz własną kompozycję
        </h2>

        {/* Tabs */}
        <div className="flex gap-sm mb-md border-b border-surface-variant pb-2 overflow-x-auto hide-scrollbar">
          {INGREDIENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'font-label-lg text-label-lg whitespace-nowrap px-2 pb-1 transition-colors',
                activeCategory === cat.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Ingredients */}
        <div className="flex-grow overflow-y-auto pr-sm mb-lg space-y-md h-64 lg:h-auto">
          <div className="grid grid-cols-2 gap-sm">
            {filteredIngredients.map((ingredient) => {
              const isSelected = selectedIngredients.includes(ingredient.id)
              return (
                <button
                  key={ingredient.id}
                  type="button"
                  onClick={() => toggleIngredient(ingredient.id)}
                  className={cn(
                    'ingredient-chip bg-surface-container flex items-center gap-2 p-2 rounded-full cursor-pointer border transition-colors text-left',
                    isSelected
                      ? 'border-2 border-primary'
                      : 'border-outline-variant hover:bg-surface-container-high',
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center overflow-hidden shrink-0">
                    {'image' in ingredient && ingredient.image ? (
                      <img
                        src={ingredient.image}
                        alt={ingredient.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon
                        name={'icon' in ingredient ? ingredient.icon : 'restaurant'}
                        className="text-secondary text-sm"
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-grow min-w-0">
                    <span className="font-label-sm text-label-sm text-on-surface truncate">
                      {ingredient.name}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[10px]">
                      +{formatPrice(ingredient.price)}
                    </span>
                  </div>
                  <Icon name="drag_indicator" className="text-outline text-sm shrink-0 pr-1" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Summary */}
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
              onClick={() => console.log('Add to cart')}
            >
              Dodaj do koszyka
            </Button>
            <Button
              variant="secondary"
              fullWidth
              leftIcon={<Icon name="favorite" className="text-sm" />}
              onClick={() => console.log('Save composition')}
            >
              Zapisz kompozycję
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
