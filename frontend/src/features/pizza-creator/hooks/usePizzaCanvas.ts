import { useRef, useState, useCallback, useEffect, type RefObject } from 'react';
import type { PlacedIngredient } from '../types';
import type { DraggedFromPalette } from '../PizzaCanvas';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PIZZA_CENTER_X,
  PIZZA_CENTER_Y,
  PIZZA_RADIUS,
  getIngredientDisplaySize,
  isInsidePizza,
  isClickOnIngredient,
  generateIngredientId,
  loadImage,
} from '../utils/canvasHelpers';

interface UsePizzaCanvasProps {
  onIngredientsChange?: (ingredients: PlacedIngredient[]) => void;
}

export const usePizzaCanvas = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  props?: UsePizzaCanvasProps,
) => {
  const [placedIngredients, setPlacedIngredients] = useState<PlacedIngredient[]>([]);
  const [draggedIngredient, setDraggedIngredient] = useState<PlacedIngredient | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);
  const [draggedFromPalette, setDraggedFromPalette] = useState<DraggedFromPalette | null>(null);

  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const dragOffset = useRef({ x: 0, y: 0 });
  const pizzaBaseImage = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    loadImage('/images/ingredients/dough.png')
      .then((img) => {
        pizzaBaseImage.current = img;
      })
      .catch(() => {
        console.warn('Pizza base image not found, using placeholder');
      });
  }, []);

  const preloadImages = useCallback(async (urls: string[]) => {
    const loadPromises = urls
      .filter(Boolean)
      .map(async (url) => {
        if (!imageCache.current.has(url)) {
          try {
            const img = await loadImage(url);
            imageCache.current.set(url, img);
          } catch (error) {
            console.error(`Failed to load image: ${url}`, error);
          }
        }
      });

    await Promise.all(loadPromises);
  }, []);

  const drawPizza = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#fcf9f8';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.save();
    ctx.beginPath();
    ctx.arc(PIZZA_CENTER_X, PIZZA_CENTER_Y, PIZZA_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#f4e4c1';
    ctx.fill();
    ctx.strokeStyle = '#d4a574';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    if (pizzaBaseImage.current) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(PIZZA_CENTER_X, PIZZA_CENTER_Y, PIZZA_RADIUS, 0, Math.PI * 2);
      ctx.clip();
      const imgSize = PIZZA_RADIUS * 2;
      ctx.drawImage(
        pizzaBaseImage.current,
        PIZZA_CENTER_X - PIZZA_RADIUS,
        PIZZA_CENTER_Y - PIZZA_RADIUS,
        imgSize,
        imgSize,
      );
      ctx.restore();
    }

    placedIngredients
      .filter((ingredient) => ingredient.id !== draggedIngredient?.id)
      .forEach((ingredient) => {
        const img = imageCache.current.get(ingredient.imageUrl);
        if (!img) return;

        ctx.save();
        ctx.translate(ingredient.x, ingredient.y);
        if (ingredient.rotation) {
          ctx.rotate((ingredient.rotation * Math.PI) / 180);
        }
        const size = getIngredientDisplaySize(ingredient.defaultSize, ingredient.scale);
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
      });

    if (previewPosition && draggedFromPalette) {
      const img = imageCache.current.get(draggedFromPalette.imageUrl);
      if (img) {
        const previewSize = getIngredientDisplaySize(draggedFromPalette.defaultSize);
        ctx.globalAlpha = 0.7;
        ctx.drawImage(
          img,
          previewPosition.x - previewSize / 2,
          previewPosition.y - previewSize / 2,
          previewSize,
          previewSize,
        );
        ctx.globalAlpha = 1.0;

        if (!isInsidePizza(previewPosition.x, previewPosition.y)) {
          ctx.strokeStyle = '#ba1a1a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(
            previewPosition.x,
            previewPosition.y,
            previewSize / 2 + 5,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
        }
      }
    }

    if (draggedIngredient) {
      const img = imageCache.current.get(draggedIngredient.imageUrl);
      if (img) {
        ctx.globalAlpha = 0.8;
        const size = getIngredientDisplaySize(
          draggedIngredient.defaultSize,
          draggedIngredient.scale,
        );
        ctx.save();
        ctx.translate(draggedIngredient.x, draggedIngredient.y);
        if (draggedIngredient.rotation) {
          ctx.rotate((draggedIngredient.rotation * Math.PI) / 180);
        }
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
        ctx.globalAlpha = 1.0;
      }
    }
  }, [
    canvasRef,
    placedIngredients,
    previewPosition,
    draggedFromPalette,
    draggedIngredient,
  ]);

  useEffect(() => {
    let animationId: number;
    const animate = () => {
      drawPizza();
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [drawPizza]);

  const addIngredient = useCallback(
    (
      ingredientId: number,
      x: number,
      y: number,
      name: string,
      price: number,
      imageUrl: string,
      defaultSize: number,
    ) => {
      if (!isInsidePizza(x, y)) return;

      void preloadImages([imageUrl]);

      const newIngredient: PlacedIngredient = {
        id: generateIngredientId(),
        ingredientId,
        x,
        y,
        name,
        price,
        imageUrl,
        defaultSize,
        rotation: Math.random() * 360,
        scale: 1,
      };

      setPlacedIngredients((prev) => {
        const updated = [...prev, newIngredient];
        props?.onIngredientsChange?.(updated);
        return updated;
      });
    },
    [props, preloadImages],
  );

  const updateIngredientPosition = useCallback(
    (id: string, x: number, y: number) => {
      setPlacedIngredients((prev) => {
        const updated = prev.map((ingredient) =>
          ingredient.id === id ? { ...ingredient, x, y } : ingredient,
        );
        props?.onIngredientsChange?.(updated);
        return updated;
      });
    },
    [props],
  );

  const removeIngredient = useCallback(
    (id: string) => {
      setPlacedIngredients((prev) => {
        const updated = prev.filter((ing) => ing.id !== id);
        props?.onIngredientsChange?.(updated);
        return updated;
      });
    },
    [props],
  );

  const clearAll = useCallback(() => {
    setPlacedIngredients([]);
    props?.onIngredientsChange?.([]);
  }, [props]);

  const undoLast = useCallback(() => {
    setPlacedIngredients((prev) => {
      const updated = prev.slice(0, -1);
      props?.onIngredientsChange?.(updated);
      return updated;
    });
  }, [props]);

  const exportAsImage = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 400;
    tempCanvas.height = 400;
    const tempCtx = tempCanvas.getContext('2d');

    if (tempCtx) {
      tempCtx.drawImage(canvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0, 400, 400);
    }

    return tempCanvas.toDataURL('image/png');
  }, [canvasRef]);

  const findIngredientAt = useCallback(
    (x: number, y: number): PlacedIngredient | null => {
      for (let i = placedIngredients.length - 1; i >= 0; i--) {
        const ingredient = placedIngredients[i];
        if (isClickOnIngredient(
          x,
          y,
          ingredient.x,
          ingredient.y,
          getIngredientDisplaySize(ingredient.defaultSize, ingredient.scale),
        )) {
          return ingredient;
        }
      }
      return null;
    },
    [placedIngredients],
  );

  return {
    placedIngredients,
    draggedFromPalette,
    setDraggedFromPalette,
    previewPosition,
    setPreviewPosition,
    draggedIngredient,
    setDraggedIngredient,
    dragOffset,
    addIngredient,
    updateIngredientPosition,
    removeIngredient,
    clearAll,
    undoLast,
    exportAsImage,
    findIngredientAt,
    preloadImages,
    drawPizza,
  };
};
