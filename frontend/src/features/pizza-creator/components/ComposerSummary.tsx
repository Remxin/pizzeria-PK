import type { PlacedIngredient } from '../types';

interface ComposerSummaryProps {
  placedIngredients: PlacedIngredient[];
  basePrice?: number;
  onAddToCart: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const ComposerSummary = ({
  placedIngredients,
  basePrice = 32,
  onAddToCart,
  onSave,
  isSaving = false,
}: ComposerSummaryProps) => {
  // Calculate ingredient cost
  const ingredientCost = placedIngredients.reduce(
    (sum, ing) => sum + ing.price,
    0
  );

  const totalPrice = basePrice + ingredientCost;

  // Group ingredients by name with count
  const ingredientGroups = placedIngredients.reduce((acc, ing) => {
    if (acc[ing.ingredientId]) {
      acc[ing.ingredientId].count++;
    } else {
      acc[ing.ingredientId] = {
        name: ing.name,
        price: ing.price,
        count: 1,
      };
    }
    return acc;
  }, {} as Record<number, { name: string; price: number; count: number }>);

  return (
    <div className="composer-summary">
      <h3 className="summary-title">Podsumowanie</h3>

      <div className="price-breakdown">
        <div className="price-item">
          <span>Ciasto podstawowe</span>
          <span>{basePrice.toFixed(2)} zł</span>
        </div>

        {Object.values(ingredientGroups).length > 0 && (
          <div className="ingredients-list">
            <h4>Składniki:</h4>
            {Object.values(ingredientGroups).map((group, index) => (
              <div key={index} className="price-item ingredient-item">
                <span>
                  {group.name} × {group.count}
                </span>
                <span>{(group.price * group.count).toFixed(2)} zł</span>
              </div>
            ))}
          </div>
        )}

        <div className="price-divider"></div>

        <div className="price-item total-price">
          <span>Razem</span>
          <span>{totalPrice.toFixed(2)} zł</span>
        </div>
      </div>

      <div className="summary-actions">
        <button
          className="btn btn-primary"
          onClick={onSave}
          disabled={placedIngredients.length === 0 || isSaving}
        >
          {isSaving ? 'Zapisywanie...' : 'Zapisz kompozycję'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={onAddToCart}
          disabled={placedIngredients.length === 0}
        >
          Dodaj do koszyka
        </button>
      </div>

      {placedIngredients.length === 0 && (
        <p className="empty-message">
          Przeciągnij składniki na pizzę, aby rozpocząć komponowanie
        </p>
      )}
    </div>
  );
};
