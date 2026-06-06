import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PizzaCanvas,
  IngredientPalette,
  ComposerSummary,
  CanvasControls,
  usePizzaCanvas,
  usePizzaComposer,
} from '../../features/pizza-creator';
import type { Ingredient } from '../../types/product.types';
import { toNumber } from '../../utils/decimal';

export function PizzaCreatorPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    placedIngredients,
    draggedFromPalette,
    setDraggedFromPalette,
    draggedIngredient,
    setDraggedIngredient,
    dragOffset,
    setPreviewPosition,
    addIngredient,
    updateIngredientPosition,
    findIngredientAt,
    clearAll,
    undoLast,
    exportAsImage,
    preloadImages,
  } = usePizzaCanvas(canvasRef);

  const {
    isSaving,
    handleAddToCart,
    handleSaveComposition,
  } = usePizzaComposer({
    placedIngredients,
    basePrice: 32,
    canvasImageExporter: exportAsImage,
  });

  const handleDragFromPalette = useCallback(
    (ingredient: Ingredient) => {
      const imageUrl = ingredient.imageUrl ?? '';

      setDraggedFromPalette({
        ingredientId: ingredient.id,
        name: ingredient.name,
        price: toNumber(ingredient.priceForClient),
        defaultSize: ingredient.defaultSize ?? 1,
        imageUrl,
      });

      if (imageUrl) {
        void preloadImages([imageUrl]);
      }
    },
    [preloadImages, setDraggedFromPalette],
  );

  const handleSave = useCallback(async () => {
    await handleSaveComposition('Moja Pizza');
  }, [handleSaveComposition]);

  const handleCart = useCallback(() => {
    handleAddToCart();
    navigate('/cart');
  }, [handleAddToCart, navigate]);

  return (
    <main className="flex-grow container mx-auto px-4 lg:px-6 py-8 flex flex-col max-w-container-max">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-8 text-center lg:text-left">
        Stwórz własną pizzę
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 flex flex-col items-center w-full">
          <PizzaCanvas
            canvasRef={canvasRef}
            draggedFromPalette={draggedFromPalette}
            draggedIngredient={draggedIngredient}
            dragOffset={dragOffset}
            setPreviewPosition={setPreviewPosition}
            setDraggedIngredient={setDraggedIngredient}
            setDraggedFromPalette={setDraggedFromPalette}
            addIngredient={addIngredient}
            updateIngredientPosition={updateIngredientPosition}
            findIngredientAt={findIngredientAt}
          />

          <CanvasControls
            onClear={clearAll}
            onUndo={undoLast}
            canUndo={placedIngredients.length > 0}
          />

          <p className="mt-4 text-sm text-on-surface-variant text-center max-w-md">
            Przeciągnij składniki z palety po prawej stronie na pizzę. Możesz je dowolnie układać!
          </p>
        </div>

        <div className="w-full lg:w-96 flex flex-col gap-6">
          <IngredientPalette onDragStart={handleDragFromPalette} />

          <ComposerSummary
            placedIngredients={placedIngredients}
            basePrice={32}
            onAddToCart={handleCart}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      </div>
    </main>
  );
}
