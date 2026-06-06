import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  productsService,
  type CreateProductPayload,
  type ProductQuery,
  type UpdateProductPayload,
} from '../../services/products.service'
import type { PaginationMeta } from '../../types/api.types'
import type { Product } from '../../types/product.types'
import { getApiErrorMessage } from '../../utils/apiError'

interface ProductsState {
  items: Product[]
  selectedProduct: Product | null
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  meta: null,
  loading: false,
  error: null,
}

export const fetchProductsAsync = createAsyncThunk(
  'products/fetchAll',
  async (query: ProductQuery | undefined, { rejectWithValue }) => {
    try {
      return await productsService.getAll(query)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się pobrać produktów'))
    }
  },
)

export const fetchProductByIdAsync = createAsyncThunk(
  'products/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await productsService.getById(id)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się pobrać produktu'))
    }
  },
)

export const createProductAsync = createAsyncThunk(
  'products/create',
  async (payload: CreateProductPayload, { rejectWithValue }) => {
    try {
      return await productsService.create(payload)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się utworzyć produktu'))
    }
  },
)

export const updateProductAsync = createAsyncThunk(
  'products/update',
  async (
    { id, payload }: { id: number; payload: UpdateProductPayload },
    { rejectWithValue },
  ) => {
    try {
      return await productsService.update(id, payload)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się zaktualizować produktu'))
    }
  },
)

export const deleteProductAsync = createAsyncThunk(
  'products/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await productsService.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się usunąć produktu'))
    }
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data
        state.meta = action.payload.meta
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.selectedProduct = action.payload
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        )
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
  },
})

export const { clearProductsError } = productsSlice.actions
export default productsSlice.reducer
