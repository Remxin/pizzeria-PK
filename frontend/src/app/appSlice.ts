import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User, UserRole } from '../types/user.types'

interface AppState {
  user: User | null
  devPreviewRole: UserRole | null
}

const initialState: AppState = {
  user: null,
  devPreviewRole: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setDevPreviewRole: (state, action: PayloadAction<UserRole | null>) => {
      state.devPreviewRole = action.payload
    },
  },
})

export const { setUser, setDevPreviewRole } = appSlice.actions
export default appSlice.reducer
