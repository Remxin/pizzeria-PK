import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { ProductCard } from '../../components/features/ProductCard'
import { Button } from '../../components/common/Button'
import { Icon } from '../../components/common/Icon'
import { fetchCategoriesAsync } from '../../features/categories/categoriesSlice'
import { addToCart, selectCartItemCount } from '../../features/cart/cartSlice'
import { fetchProductsAsync } from '../../features/products/productsSlice'
import { cn } from '../../utils/cn'
import { toNumber } from '../../utils/decimal'

const FALLBACK_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBw2n7K3k8UdhpxxugZAMK0UiVQ1_hPWnmScqTj9BoNdz2EP-T5XgPnhu1cBoGM_CPOzyZcfk_6B6i4-IN7UW6QoyQFiYb1UpJp3IwLjHMXhgrkbNFxyinFCmWRvE-O4qWmbJ_X1rf2-jYssHAsCRcObSCJzh-HIv-5HE1XScyW4zQmUXJzkztZMElmokSSb5E4SyHsSssDy15GOUu8yeUIL2CO9UxI0PqkZc12HIB8GA0K35wCjde_V-I8rtEcGOIpUGmhCxoCc_QM'

export function MenuPage() {
  const dispatch = useAppDispatch()
  const { items: products, loading, error } = useAppSelector((state) => state.products)
  const { items: categories } = useAppSelector((state) => state.categories)
  const cartCount = useAppSelector(selectCartItemCount)
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)

  useEffect(() => {
    dispatch(fetchCategoriesAsync({ type: 'PRODUCT' }))
    dispatch(fetchProductsAsync({ isAvailable: true, limit: 50 }))
  }, [dispatch])

  useEffect(() => {
    if (categories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(categories[0].id)
    }
  }, [categories, activeCategoryId])

  const filteredProducts = useMemo(() => {
    if (!activeCategoryId) {
      return products
    }

    return products.filter((product) => product.categoryId === activeCategoryId)
  }, [products, activeCategoryId])

  const handleAddToCart = (productId: number) => {
    const product = products.find((item) => item.id === productId)

    if (!product) {
      return
    }

    dispatch(
      addToCart({
        id: `product-${product.id}`,
        type: 'product',
        productId: product.id,
        name: product.name,
        price: toNumber(product.basePrice),
        quantity: 1,
        imageUrl: product.imageUrl ?? undefined,
      }),
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-lg py-lg space-y-xl">
      <section
        className="relative rounded-xl overflow-hidden shadow-level-2 h-64 md:h-80 flex items-center justify-center group cursor-pointer"
        style={{
          backgroundImage: `url('${FALLBACK_IMAGE}')`,
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

      <section>
        <div className="flex overflow-x-auto gap-md pb-sm snap-x hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              className={cn(
                'flex-shrink-0 snap-start px-md py-sm rounded-full font-label-lg text-label-lg border transition-colors',
                activeCategoryId === category.id
                  ? 'bg-primary-container text-on-primary-container border-primary/20'
                  : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-variant',
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {loading && (
        <div className="text-center py-xl">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Ładowanie menu...
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-md">
          <p className="font-body-md text-body-md text-error">{error}</p>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-xl">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Brak produktów w tej kategorii.
          </p>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={toNumber(product.basePrice)}
            description={product.description ?? ''}
            image={product.imageUrl ?? FALLBACK_IMAGE}
            onAddToCart={() => handleAddToCart(product.id)}
          />
        ))}
      </section>

      {cartCount > 0 && (
        <Link
          to="/cart"
          className="md:hidden fixed bottom-20 right-margin-mobile z-30 flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-full shadow-level-2 font-label-lg text-label-lg"
        >
          <Icon name="shopping_cart" />
          Koszyk ({cartCount})
        </Link>
      )}
    </div>
  )
}
