import type { Ingredient } from '../../../types/product.types';
import { toNumber } from '../../../utils/decimal';
import { formatPrice } from '../../../utils/format';

interface IngredientChipProps {
  ingredient: Ingredient;
  onDragStart: (ingredient: Ingredient) => void;
}

export const IngredientChip = ({
  ingredient,
  onDragStart,
}: IngredientChipProps) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onDragStart(ingredient);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    onDragStart(ingredient);
  };

  const price = toNumber(ingredient.priceForClient);

  return (
    <div
      className="ingredient-chip"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        cursor: 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      <div className="ingredient-image">
        {ingredient.imageUrl ? (
          <img
            src={ingredient.imageUrl}
            alt={ingredient.name}
            draggable={false}
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        ) : (
          <div className="w-[60px] h-[60px] rounded-full bg-surface-container flex items-center justify-center text-xs text-on-surface-variant">
            {ingredient.name.slice(0, 2)}
          </div>
        )}
      </div>
      <div className="ingredient-info text-center">
        <span className="ingredient-name text-sm font-medium text-on-surface">
          {ingredient.name}
        </span>
        <span className="ingredient-price text-xs text-on-surface-variant">
          +{formatPrice(price)}
        </span>
      </div>
    </div>
  );
};
