import { Icon } from '../common/Icon'
import { formatPrice } from '../../utils/format'

const FALLBACK_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBw2n7K3k8UdhpxxugZAMK0UiVQ1_hPWnmScqTj9BoNdz2EP-T5XgPnhu1cBoGM_CPOzyZcfk_6B6i4-IN7UW6QoyQFiYb1UpJp3IwLjHMXhgrkbNFxyinFCmWRvE-O4qWmbJ_X1rf2-jYssHAsCRcObSCJzh-HIv-5HE1XScyW4zQmUXJzkztZMElmokSSb5E4SyHsSssDy15GOUu8yeUIL2CO9UxI0PqkZc12HIB8GA0K35wCjde_V-I8rtEcGOIpUGmhCxoCc_QM'

interface CartItemProps {
  name: string
  size?: string
  price: number
  quantity: number
  image?: string
  onIncrease?: () => void
  onDecrease?: () => void
  onRemove?: () => void
}

export function CartItem({
  name,
  size,
  price,
  quantity,
  image,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex gap-md p-md bg-surface-container-lowest rounded-xl border border-surface-container-highest shadow-level-1">
      <img
        src={image ?? FALLBACK_IMAGE}
        alt={name}
        className="w-20 h-20 rounded-lg object-cover shrink-0"
      />
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start gap-sm">
          <div>
            <h3 className="font-label-lg text-label-lg text-on-surface truncate">{name}</h3>
            {size && (
              <p className="font-body-sm text-body-sm text-on-surface-variant">{size}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-on-surface-variant hover:text-error transition-colors shrink-0"
            aria-label={`Usuń ${name}`}
          >
            <Icon name="delete" className="text-lg" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-sm">
          <div className="flex items-center gap-sm bg-surface-container rounded-lg p-xs">
            <button
              type="button"
              onClick={onDecrease}
              className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Zmniejsz ilość"
            >
              <Icon name="remove" />
            </button>
            <span className="font-label-lg text-label-lg text-on-surface w-6 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Zwiększ ilość"
            >
              <Icon name="add" />
            </button>
          </div>
          <span className="font-label-lg text-label-lg text-primary">
            {formatPrice(price * quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
