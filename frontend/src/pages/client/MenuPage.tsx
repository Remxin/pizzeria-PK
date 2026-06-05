import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/features/ProductCard'
import { Button } from '../../components/common/Button'
import { Icon } from '../../components/common/Icon'
import { MENU_CATEGORIES, MOCK_PRODUCTS } from '../../constants/mockData'
import { cn } from '../../utils/cn'

export function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>('pizza')

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-lg py-lg space-y-xl">
      {/* Hero CTA */}
      <section
        className="relative rounded-xl overflow-hidden shadow-level-2 h-64 md:h-80 flex items-center justify-center group cursor-pointer"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBw2n7K3k8UdhpxxugZAMK0UiVQ1_hPWnmScqTj9BoNdz2EP-T5XgPnhu1cBoGM_CPOzyZcfk_6B6i4-IN7UW6QoyQFiYb1UpJp3IwLjHMXhgrkbNFxyinFCmWRvE-O4qWmbJ_X1rf2-jYssHAsCRcObSCJzh-HIv-5HE1XScyW4zQmUXJzkztZMElmokSSb5E4SyHsSssDy15GOUu8yeUIL2CO9UxI0PqkZc12HIB8GA0K35wCjde_V-I8rtEcGOIpUGmhCxoCc_QM')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-surface-tint/60 group-hover:bg-surface-tint/70 transition-colors duration-300" />
        <div className="relative z-10 text-center text-on-primary p-md">
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg mb-sm">
            Stwórz Własną
          </h1>
          <p className="font-body-lg text-body-lg mb-md opacity-90">
            Skomponuj idealną pizzę od podstaw.
          </p>
          <Link to="/creator">
            <Button className="rounded-full shadow-level-2">Zbuduj Teraz</Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex overflow-x-auto gap-md pb-sm snap-x hide-scrollbar">
          {MENU_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'flex-shrink-0 snap-start px-md py-sm rounded-full font-label-lg text-label-lg border transition-colors',
                activeCategory === category.id
                  ? 'bg-primary-container text-on-primary-container border-primary/20'
                  : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-variant',
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            image={product.image}
            vegetarian={product.vegetarian}
            onAddToCart={() => console.log('Add to cart:', product.name)}
          />
        ))}
      </section>

      {/* Sticky cart button - mobile only */}
      <Link
        to="/cart"
        className="md:hidden fixed bottom-20 right-margin-mobile z-30 flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-full shadow-level-2 font-label-lg text-label-lg"
      >
        <Icon name="shopping_cart" />
        Koszyk (2)
      </Link>
    </div>
  )
}
