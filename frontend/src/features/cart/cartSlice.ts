import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { customPizzaService } from '../../services/customPizza.service'
import { ordersService } from '../../services/orders.service'
import type { CartItem } from '../../types/cart.types'
import type { CreateOrderPayload, Order } from '../../types/order.types'
import { getApiErrorMessage } from '../../utils/apiError'
import { CART_STORAGE_KEY } from '../../utils/authStorage'

interface CartState {
  items: CartItem[]
  placingOrder: boolean
  orderError: string | null
  lastOrder: Order | null
}

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveCartToStorage(items: CartItem[]): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

const initialState: CartState = {
  items: loadCartFromStorage(),
  placingOrder: false,
  orderError: null,
  lastOrder: null,
}

export const placeOrderAsync = createAsyncThunk(
  'cart/placeOrder',
  async (payload: CreateOrderPayload, { rejectWithValue }) => {
    try {
      return await ordersService.create(payload)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się złożyć zamówienia'))
    }
  },
)

export async function buildOrderItemsFromCart(
  cartItems: CartItem[],
  isAuthenticated: boolean,
): Promise<CreateOrderPayload['items']> {
  const orderItems: CreateOrderPayload['items'] = []

  for (const item of cartItems) {
    if (item.type === 'product' && item.productId) {
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        ingredients: item.ingredients?.map((ingredient) => ({
          ingredientId: ingredient.ingredientId,
          quantity: ingredient.quantity,
        })),
      })
      continue
    }

    if (item.type === 'custom') {
      if (!isAuthenticated) {
        throw new Error('Zaloguj się, aby zamówić własną pizzę')
      }

      let customPizzaId = item.customPizzaId

      if (!customPizzaId && item.ingredients?.length) {
        const saved = await customPizzaService.create({
          name: item.name,
          ingredients: item.ingredients.map((ingredient) => ({
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity,
          })),
        })
        customPizzaId = saved.id
      }

      if (!customPizzaId) {
        throw new Error('Nie udało się przygotować własnej pizzy')
      }

      orderItems.push({
        customPizzaId,
        quantity: item.quantity,
      })
    }
  }

  return orderItems
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((item) => item.id === action.payload.id)

      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }

      saveCartToStorage(state.items)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      saveCartToStorage(state.items)
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload.id)

      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
      }

      saveCartToStorage(state.items)
    },
    clearCart: (state) => {
      state.items = []
      saveCartToStorage(state.items)
    },
    clearOrderError: (state) => {
      state.orderError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderAsync.pending, (state) => {
        state.placingOrder = true
        state.orderError = null
      })
      .addCase(placeOrderAsync.fulfilled, (state, action) => {
        state.placingOrder = false
        state.lastOrder = action.payload
        state.items = []
        saveCartToStorage(state.items)
      })
      .addCase(placeOrderAsync.rejected, (state, action) => {
        state.placingOrder = false
        state.orderError = action.payload as string
      })
  },
})

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  clearOrderError,
} = cartSlice.actions

export const selectCartTotal = (state: { cart: CartState }) =>
  calculateTotal(state.cart.items)

export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

export default cartSlice.reducer
