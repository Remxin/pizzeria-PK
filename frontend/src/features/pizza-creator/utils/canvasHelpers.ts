export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 600;
export const PIZZA_RADIUS = 250;
export const PIZZA_CENTER_X = CANVAS_WIDTH / 2;
export const PIZZA_CENTER_Y = CANVAS_HEIGHT / 2;
export const INGREDIENT_SIZE = 60;

export const getIngredientDisplaySize = (
  defaultSize: number,
  scale: number = 1,
): number => INGREDIENT_SIZE * defaultSize * scale;

/**
 * Check if a point (x, y) is inside the circular pizza area
 */
export const isInsidePizza = (x: number, y: number): boolean => {
  const distance = Math.sqrt(
    Math.pow(x - PIZZA_CENTER_X, 2) + Math.pow(y - PIZZA_CENTER_Y, 2)
  );
  return distance <= PIZZA_RADIUS;
};

/**
 * Get canvas coordinates from mouse/touch event
 */
export const getCanvasCoordinates = (
  event: { clientX: number; clientY: number },
  canvas: HTMLCanvasElement
): { x: number; y: number } => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
};

/**
 * Check if a click is on a specific ingredient
 */
export const isClickOnIngredient = (
  clickX: number,
  clickY: number,
  ingredientX: number,
  ingredientY: number,
  ingredientSize: number = INGREDIENT_SIZE
): boolean => {
  const halfSize = ingredientSize / 2;
  return (
    clickX >= ingredientX - halfSize &&
    clickX <= ingredientX + halfSize &&
    clickY >= ingredientY - halfSize &&
    clickY <= ingredientY + halfSize
  );
};

/**
 * Load an image and return a promise
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Generate a unique ID for placed ingredients
 */
export const generateIngredientId = (): string => {
  return `ingredient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
