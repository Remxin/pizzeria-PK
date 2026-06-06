import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  ingredientsService,
  type CreateIngredientPayload,
  type IngredientQuery,
  type UpdateIngredientPayload,
} from '../../services/ingredients.service'
import type { PaginationMeta } from '../../types/api.types'
import type { Ingredient } from '../../types/product.types'
import { getApiErrorMessage } from '../../utils/apiError'

interface IngredientsState {
  items: Ingredient[]
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
}

const initialState: IngredientsState = {
  items: [],
  meta: null,
  loading: false,
  error: null,
}

export const fetchIngredientsAsync = createAsyncThunk(
  'ingredients/fetchAll',
  async (query: IngredientQuery | undefined, { rejectWithValue }) => {
    try {
      return await ingredientsService.getAll(query)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się pobrać składników'))
    }
  },
)

export const createIngredientAsync = createAsyncThunk(
  'ingredients/create',
  async (payload: CreateIngredientPayload, { rejectWithValue }) => {
    try {
      return await ingredientsService.create(payload)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się utworzyć składnika'))
    }
  },
)

export const updateIngredientAsync = createAsyncThunk(
  'ingredients/update',
  async (
    { id, payload }: { id: number; payload: UpdateIngredientPayload },
    { rejectWithValue },
  ) => {
    try {
      return await ingredientsService.update(id, payload)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się zaktualizować składnika'))
    }
  },
)

export const deleteIngredientAsync = createAsyncThunk(
  'ingredients/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await ingredientsService.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się usunąć składnika'))
    }
  },
)

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearIngredientsError: (state) => {
      state.error = null
    },
    updateIngredientInList: (state, action: { payload: Ingredient }) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item,
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIngredientsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data
        state.meta = action.payload.meta
      })
      .addCase(fetchIngredientsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createIngredientAsync.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateIngredientAsync.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        )
      })
      .addCase(deleteIngredientAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
  },
})

export const { clearIngredientsError, updateIngredientInList } = ingredientsSlice.actions
export default ingredientsSlice.reducer
