export interface PlacedIngredient {
  id: string;
  ingredientId: number;
  x: number;
  y: number;
  imageUrl: string;
  name: string;
  price: number;
  rotation?: number;
  scale?: number;
}

export interface DragState {
  isDragging: boolean;
  ingredientId: number | null;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export interface CanvasIngredient extends PlacedIngredient {}

export interface PizzaComposerState {
  placedIngredients: PlacedIngredient[];
  totalPrice: number;
  basePrice: number;
}
