import { useState, useCallback } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { addToCart } from '../../cart/cartSlice';
import { saveCustomPizzaAsync } from '../../customPizzas/customPizzasSlice';
import type { PlacedIngredient } from '../types';

interface UsePizzaComposerProps {
  placedIngredients: PlacedIngredient[];
  basePrice?: number;
  canvasImageExporter?: () => string;
}

export const usePizzaComposer = ({
  placedIngredients,
  basePrice = 32,
  canvasImageExporter,
}: UsePizzaComposerProps) => {
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);

  const totalPrice =
    basePrice + placedIngredients.reduce((sum, ing) => sum + ing.price, 0);

  const groupIngredients = useCallback(() => {
    return placedIngredients.reduce(
      (acc, ingredient) => {
        const existing = acc.find(
          (item) => item.ingredientId === ingredient.ingredientId,
        );

        if (existing) {
          existing.quantity += 1;
        } else {
          acc.push({
            ingredientId: ingredient.ingredientId,
            quantity: 1,
            name: ingredient.name,
            price: ingredient.price,
          });
        }

        return acc;
      },
      [] as {
        ingredientId: number;
        quantity: number;
        name: string;
        price: number;
      }[],
    );
  }, [placedIngredients]);

  const handleAddToCart = useCallback(() => {
    if (placedIngredients.length === 0) return;

    const groupedIngredients = groupIngredients();

    dispatch(
      addToCart({
        id: `custom-${Date.now()}`,
        type: 'custom',
        name: 'Moja Pizza',
        price: totalPrice,
        quantity: 1,
        imageUrl: canvasImageExporter?.(),
        ingredients: groupedIngredients,
      }),
    );
  }, [dispatch, placedIngredients.length, groupIngredients, totalPrice, canvasImageExporter]);

  const handleSaveComposition = useCallback(
    async (name: string = 'Moja Pizza') => {
      if (placedIngredients.length === 0 || isSaving) return false;

      setIsSaving(true);

      try {
        const imageUrl = canvasImageExporter?.();
        const groupedIngredients = groupIngredients();

        await dispatch(
          saveCustomPizzaAsync({
            name,
            imageUrl,
            ingredients: groupedIngredients.map((ingredient) => ({
              ingredientId: ingredient.ingredientId,
              quantity: ingredient.quantity,
            })),
          }),
        ).unwrap();

        return true;
      } catch (error) {
        console.error('Failed to save custom pizza:', error);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [dispatch, placedIngredients.length, isSaving, canvasImageExporter, groupIngredients],
  );

  return {
    totalPrice,
    isSaving,
    handleAddToCart,
    handleSaveComposition,
  };
};
