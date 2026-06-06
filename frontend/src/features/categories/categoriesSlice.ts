import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { categoriesService, type CategoryQuery } from '../../services/categories.service'
import type { Category } from '../../types/product.types'
import { getApiErrorMessage } from '../../utils/apiError'

interface CategoriesState {
  items: Category[]
  loading: boolean
  error: string | null
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchCategoriesAsync = createAsyncThunk(
  'categories/fetchAll',
  async (query: CategoryQuery | undefined, { rejectWithValue }) => {
    try {
      return await categoriesService.getAll(query)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się pobrać kategorii'))
    }
  },
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default categoriesSlice.reducer
