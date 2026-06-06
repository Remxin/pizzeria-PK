import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import categoriesReducer from '../features/categories/categoriesSlice'
import customPizzasReducer from '../features/customPizzas/customPizzasSlice'
import ingredientsReducer from '../features/ingredients/ingredientsSlice'
import inventoryReducer from '../features/inventory/inventorySlice'
import ordersReducer from '../features/orders/ordersSlice'
import productsReducer from '../features/products/productsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    ingredients: ingredientsReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    orders: ordersReducer,
    customPizzas: customPizzasReducer,
    inventory: inventoryReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
