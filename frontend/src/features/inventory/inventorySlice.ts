import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  inventoryService,
  type StockAdjustmentPayload,
} from '../../services/inventory.service'
import type { Ingredient } from '../../types/product.types'
import { getApiErrorMessage } from '../../utils/apiError'

interface InventoryState {
  alerts: Ingredient[]
  loading: boolean
  error: string | null
}

const initialState: InventoryState = {
  alerts: [],
  loading: false,
  error: null,
}

export const fetchLowStockAlertsAsync = createAsyncThunk(
  'inventory/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      return await inventoryService.getLowStockAlerts()
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się pobrać alertów'))
    }
  },
)

export const adjustStockAsync = createAsyncThunk(
  'inventory/adjustStock',
  async (payload: StockAdjustmentPayload, { rejectWithValue }) => {
    try {
      return await inventoryService.adjustStock(payload)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się skorygować stanu'))
    }
  },
)

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventoryError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLowStockAlertsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLowStockAlertsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.alerts = action.payload
      })
      .addCase(fetchLowStockAlertsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(adjustStockAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(adjustStockAsync.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(adjustStockAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearInventoryError } = inventorySlice.actions
export default inventorySlice.reducer
