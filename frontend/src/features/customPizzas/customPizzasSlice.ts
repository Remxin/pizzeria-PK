import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  customPizzaService,
  type CreateCustomPizzaPayload,
  type UpdateCustomPizzaPayload,
} from '../../services/customPizza.service'
import type { CustomPizza } from '../../types/product.types'
import { getApiErrorMessage } from '../../utils/apiError'

interface CustomPizzasState {
  savedPizzas: CustomPizza[]
  publishedPizzas: CustomPizza[]
  loading: boolean
  error: string | null
}

const initialState: CustomPizzasState = {
  savedPizzas: [],
  publishedPizzas: [],
  loading: false,
  error: null,
}

export const fetchCustomPizzasAsync = createAsyncThunk(
  'customPizzas/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await customPizzaService.getAll()
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się pobrać pizz'))
    }
  },
)

export const fetchPublishedPizzasAsync = createAsyncThunk(
  'customPizzas/fetchPublished',
  async (_, { rejectWithValue }) => {
    try {
      return await customPizzaService.getPublished()
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się pobrać opublikowanych pizz'))
    }
  },
)

export const saveCustomPizzaAsync = createAsyncThunk(
  'customPizzas/save',
  async (payload: CreateCustomPizzaPayload, { rejectWithValue }) => {
    try {
      return await customPizzaService.create(payload)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się zapisać pizzy'))
    }
  },
)

export const deleteCustomPizzaAsync = createAsyncThunk(
  'customPizzas/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await customPizzaService.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się usunąć pizzy'))
    }
  },
)

export const updateCustomPizzaAsync = createAsyncThunk(
  'customPizzas/update',
  async (
    { id, payload }: { id: number; payload: UpdateCustomPizzaPayload },
    { rejectWithValue },
  ) => {
    try {
      return await customPizzaService.update(id, payload)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się zaktualizować pizzy'))
    }
  },
)

const customPizzasSlice = createSlice({
  name: 'customPizzas',
  initialState,
  reducers: {
    clearCustomPizzasError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomPizzasAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCustomPizzasAsync.fulfilled, (state, action) => {
        state.loading = false
        state.savedPizzas = action.payload
      })
      .addCase(fetchCustomPizzasAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchPublishedPizzasAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPublishedPizzasAsync.fulfilled, (state, action) => {
        state.loading = false
        state.publishedPizzas = action.payload
      })
      .addCase(fetchPublishedPizzasAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(saveCustomPizzaAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(saveCustomPizzaAsync.fulfilled, (state, action) => {
        state.loading = false
        state.savedPizzas.unshift(action.payload)
      })
      .addCase(saveCustomPizzaAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteCustomPizzaAsync.fulfilled, (state, action) => {
        state.savedPizzas = state.savedPizzas.filter((pizza) => pizza.id !== action.payload)
      })
      .addCase(updateCustomPizzaAsync.fulfilled, (state, action) => {
        state.savedPizzas = state.savedPizzas.map((pizza) =>
          pizza.id === action.payload.id ? action.payload : pizza,
        )
      })
  },
})

export const { clearCustomPizzasError } = customPizzasSlice.actions
export default customPizzasSlice.reducer
