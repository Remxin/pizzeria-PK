import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchIngredientsAsync } from '../../ingredients/ingredientsSlice';
import { fetchCategoriesAsync } from '../../categories/categoriesSlice';
import type { Ingredient } from '../../../types/product.types';
import { IngredientChip } from './IngredientChip';

interface IngredientPaletteProps {
  onDragStart: (ingredient: Ingredient) => void;
}

export const IngredientPalette = ({ onDragStart }: IngredientPaletteProps) => {
  const dispatch = useAppDispatch();
  const { items: ingredients, loading } = useAppSelector((state) => state.ingredients);
  const { items: categories } = useAppSelector((state) => state.categories);

  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesAsync({ type: 'INGREDIENT' }));
    dispatch(fetchIngredientsAsync({ isAvailable: true, limit: 100 }));
  }, [dispatch]);

  const ingredientCategories = categories.filter((cat) => cat.type === 'INGREDIENT');

  useEffect(() => {
    if (!activeCategory && ingredientCategories.length > 0) {
      setActiveCategory(ingredientCategories[0].id);
    }
  }, [ingredientCategories, activeCategory]);

  const filteredIngredients = activeCategory
    ? ingredients.filter(
        (ing) => ing.categoryId === activeCategory && ing.isAvailable,
      )
    : ingredients.filter((ing) => ing.isAvailable);

  return (
    <div className="ingredient-palette">
      <h3 className="palette-title">Składniki</h3>

      <div className="category-tabs">
        {ingredientCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`category-tab ${
              activeCategory === category.id ? 'active' : ''
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="ingredients-grid">
        {loading && (
          <div className="loading-state">Ładowanie składników...</div>
        )}

        {!loading && filteredIngredients.length === 0 && (
          <div className="empty-state">
            Brak dostępnych składników w tej kategorii
          </div>
        )}

        {!loading &&
          filteredIngredients.map((ingredient) => (
            <IngredientChip
              key={ingredient.id}
              ingredient={ingredient}
              onDragStart={onDragStart}
            />
          ))}
      </div>
    </div>
  );
};
