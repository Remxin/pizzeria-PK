import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ordersService, type OrderQuery } from '../../services/orders.service'
import type { PaginationMeta } from '../../types/api.types'
import type { Order, OrderStatus } from '../../types/order.types'
import { getApiErrorMessage } from '../../utils/apiError'

interface OrdersState {
  userOrders: Order[]
  allOrders: Order[]
  currentOrder: Order | null
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
}

const initialState: OrdersState = {
  userOrders: [],
  allOrders: [],
  currentOrder: null,
  meta: null,
  loading: false,
  error: null,
}

export const fetchUserOrdersAsync = createAsyncThunk(
  'orders/fetchUserOrders',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await ordersService.getUserOrders(userId)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się pobrać zamówień'))
    }
  },
)

export const fetchMyOrdersAsync = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { usersService } = await import('../../services/users.service')
      return await usersService.getMyOrders()
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się pobrać zamówień'))
    }
  },
)

export const fetchAllOrdersAsync = createAsyncThunk(
  'orders/fetchAll',
  async (query: OrderQuery | undefined, { rejectWithValue }) => {
    try {
      return await ordersService.getAll(query)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się pobrać zamówień'))
    }
  },
)

export const fetchOrderByIdAsync = createAsyncThunk(
  'orders/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await ordersService.getById(id)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się pobrać zamówienia'))
    }
  },
)

export const updateOrderStatusAsync = createAsyncThunk(
  'orders/updateStatus',
  async (
    { id, status }: { id: number; status: OrderStatus },
    { rejectWithValue },
  ) => {
    try {
      return await ordersService.updateStatus(id, status)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się zaktualizować statusu'))
    }
  },
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null
    },
    updateOrderInLists: (state, action: { payload: Order }) => {
      const order = action.payload

      state.currentOrder =
        state.currentOrder?.id === order.id ? order : state.currentOrder

      state.allOrders = state.allOrders.map((item) =>
        item.id === order.id ? order : item,
      )

      state.userOrders = state.userOrders.map((item) =>
        item.id === order.id ? order : item,
      )
    },
    addOrderToList: (state, action: { payload: Order }) => {
      state.allOrders = [action.payload, ...state.allOrders]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrdersAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserOrdersAsync.fulfilled, (state, action) => {
        state.loading = false
        state.userOrders = action.payload
      })
      .addCase(fetchUserOrdersAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchMyOrdersAsync.fulfilled, (state, action) => {
        state.userOrders = action.payload
      })
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
        state.loading = false
        state.allOrders = action.payload.data
        state.meta = action.payload.meta
      })
      .addCase(fetchAllOrdersAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchOrderByIdAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderByIdAsync.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchOrderByIdAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
        const order = action.payload
        state.allOrders = state.allOrders.map((item) =>
          item.id === order.id ? order : item,
        )
        state.currentOrder =
          state.currentOrder?.id === order.id ? order : state.currentOrder
      })
  },
})

export const { clearOrdersError, updateOrderInLists, addOrderToList } = ordersSlice.actions
export default ordersSlice.reducer
