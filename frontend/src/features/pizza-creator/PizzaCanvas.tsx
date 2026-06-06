import { useEffect, type RefObject } from 'react';
import type { PlacedIngredient } from './types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  getCanvasCoordinates,
  isInsidePizza,
} from './utils/canvasHelpers';

export interface DraggedFromPalette {
  ingredientId: number;
  name: string;
  price: number;
  defaultSize: number;
  imageUrl: string;
}

export interface PizzaCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  draggedFromPalette: DraggedFromPalette | null;
  draggedIngredient: PlacedIngredient | null;
  dragOffset: RefObject<{ x: number; y: number }>;
  setPreviewPosition: (position: { x: number; y: number } | null) => void;
  setDraggedIngredient: (ingredient: PlacedIngredient | null) => void;
  setDraggedFromPalette: (ingredient: DraggedFromPalette | null) => void;
  addIngredient: (
    ingredientId: number,
    x: number,
    y: number,
    name: string,
    price: number,
    imageUrl: string,
    defaultSize: number,
  ) => void;
  updateIngredientPosition: (id: string, x: number, y: number) => void;
  findIngredientAt: (x: number, y: number) => PlacedIngredient | null;
}

export const PizzaCanvas = ({
  canvasRef,
  draggedFromPalette,
  draggedIngredient,
  dragOffset,
  setPreviewPosition,
  setDraggedIngredient,
  setDraggedFromPalette,
  addIngredient,
  updateIngredientPosition,
  findIngredientAt,
}: PizzaCanvasProps) => {
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || draggedFromPalette) return;

    const { x, y } = getCanvasCoordinates(e.nativeEvent, canvas);
    const clicked = findIngredientAt(x, y);

    if (clicked) {
      setDraggedIngredient(clicked);
      dragOffset.current = { x: x - clicked.x, y: y - clicked.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoordinates(e.nativeEvent, canvas);

    if (draggedFromPalette) {
      setPreviewPosition({ x, y });
    }

    if (draggedIngredient) {
      setDraggedIngredient({
        ...draggedIngredient,
        x: x - dragOffset.current.x,
        y: y - dragOffset.current.y,
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoordinates(e.nativeEvent, canvas);
    finalizeDrop(x, y);
  };

  const handleMouseLeave = () => {
    if (draggedIngredient) {
      setDraggedIngredient(null);
    }
    if (!draggedFromPalette) {
      setPreviewPosition(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0 || draggedFromPalette) return;

    const touch = e.touches[0];
    const { x, y } = getCanvasCoordinates(touch, canvas);
    const clicked = findIngredientAt(x, y);

    if (clicked) {
      setDraggedIngredient(clicked);
      dragOffset.current = { x: x - clicked.x, y: y - clicked.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;

    const touch = e.touches[0];
    const { x, y } = getCanvasCoordinates(touch, canvas);

    if (draggedFromPalette) {
      setPreviewPosition({ x, y });
    }

    if (draggedIngredient) {
      setDraggedIngredient({
        ...draggedIngredient,
        x: x - dragOffset.current.x,
        y: y - dragOffset.current.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || e.changedTouches.length === 0) return;

    const touch = e.changedTouches[0];
    const { x, y } = getCanvasCoordinates(touch, canvas);
    finalizeDrop(x, y);
  };

  const finalizeDrop = (x: number, y: number) => {
    if (draggedFromPalette) {
      return;
    }

    if (draggedIngredient) {
      const finalX = x - dragOffset.current.x;
      const finalY = y - dragOffset.current.y;

      if (isInsidePizza(finalX, finalY)) {
        updateIngredientPosition(draggedIngredient.id, finalX, finalY);
      }

      setDraggedIngredient(null);
    }
  };

  useEffect(() => {
    if (!draggedFromPalette) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const isOverCanvas =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isOverCanvas) {
        const { x, y } = getCanvasCoordinates(e, canvas);
        setPreviewPosition({ x, y });
      } else {
        setPreviewPosition(null);
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setDraggedFromPalette(null);
        setPreviewPosition(null);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const isOverCanvas =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isOverCanvas) {
        const { x, y } = getCanvasCoordinates(e, canvas);
        addIngredient(
          draggedFromPalette.ingredientId,
          x,
          y,
          draggedFromPalette.name,
          draggedFromPalette.price,
          draggedFromPalette.imageUrl,
          draggedFromPalette.defaultSize,
        );
      }

      setDraggedFromPalette(null);
      setPreviewPosition(null);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || e.touches.length === 0) return;

      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const isOverCanvas =
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;

      if (isOverCanvas) {
        const { x, y } = getCanvasCoordinates(touch, canvas);
        setPreviewPosition({ x, y });
      } else {
        setPreviewPosition(null);
      }
    };

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || e.changedTouches.length === 0) {
        setDraggedFromPalette(null);
        setPreviewPosition(null);
        return;
      }

      const touch = e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      const isOverCanvas =
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;

      if (isOverCanvas) {
        const { x, y } = getCanvasCoordinates(touch, canvas);
        addIngredient(
          draggedFromPalette.ingredientId,
          x,
          y,
          draggedFromPalette.name,
          draggedFromPalette.price,
          draggedFromPalette.imageUrl,
          draggedFromPalette.defaultSize,
        );
      }

      setDraggedFromPalette(null);
      setPreviewPosition(null);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    window.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [
    draggedFromPalette,
    canvasRef,
    setPreviewPosition,
    setDraggedFromPalette,
    addIngredient,
  ]);

  return (
    <div className="pizza-canvas-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="pizza-canvas"
        style={{
          border: '2px solid #e4e2e1',
          borderRadius: '12px',
          cursor: draggedFromPalette || draggedIngredient ? 'grabbing' : 'default',
          touchAction: 'none',
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
  );
};
