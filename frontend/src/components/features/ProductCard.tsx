import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { formatPrice } from '../../utils/format'

interface ProductCardProps {
  name: string
  price: number
  description: string
  image: string
  vegetarian?: boolean
  onAddToCart?: () => void
}

export function ProductCard({
  name,
  price,
  description,
  image,
  vegetarian = false,
  onAddToCart,
}: ProductCardProps) {
  return (
    <article className="bg-surface rounded-xl overflow-hidden shadow-level-1 border border-surface-variant flex flex-col group hover:shadow-level-2 transition-shadow duration-300">
      <div className="h-48 overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {vegetarian && (
          <Badge variant="success" className="absolute top-sm left-sm">
            Wege
          </Badge>
        )}
      </div>
      <div className="p-md flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-sm gap-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">{name}</h3>
          <span className="font-label-lg text-label-lg text-primary shrink-0">
            {formatPrice(price)}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-md flex-grow line-clamp-2">
          {description}
        </p>
        <Button variant="secondary" fullWidth onClick={onAddToCart}>
          Dodaj do Koszyka
        </Button>
      </div>
    </article>
  )
}
