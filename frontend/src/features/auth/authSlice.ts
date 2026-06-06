import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  authService,
  type LoginPayload,
  type RegisterPayload,
} from '../../services/auth.service'
import { connectSocket, disconnectSocket } from '../../services/socket.service'
import type { TokenPair } from '../../types/api.types'
import type { User } from '../../types/user.types'
import { getApiErrorMessage } from '../../utils/apiError'
import {
  clearTokens,
  getRefreshToken,
  hasStoredSession,
  setTokens,
} from '../../utils/authStorage'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitialized: !hasStoredSession(),
  loading: false,
  error: null,
}

function applyAuthSuccess(
  state: AuthState,
  user: User,
  accessToken: string,
  refreshToken: string,
): void {
  state.user = user
  state.accessToken = accessToken
  state.refreshToken = refreshToken
  state.isAuthenticated = true
  state.error = null
  setTokens(accessToken, refreshToken)
}

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await authService.login(payload)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Logowanie nie powiodło się'))
    }
  },
)

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await authService.register(payload)
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Rejestracja nie powiodła się'))
    }
  },
)

export const loadUserAsync = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser()
      return user
    } catch (error) {
      clearTokens()
      return rejectWithValue(getApiErrorMessage(error, 'Nie udało się załadować sesji'))
    }
  },
)

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken()

      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Wylogowanie nie powiodło się'))
    } finally {
      clearTokens()
      disconnectSocket()
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
    setTokensFromRefresh: (state, action: { payload: TokenPair }) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      setTokens(action.payload.accessToken, action.payload.refreshToken)
    },
    resetAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      clearTokens()
      disconnectSocket()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false
        applyAuthSuccess(
          state,
          action.payload.user,
          action.payload.accessToken,
          action.payload.refreshToken,
        )
        connectSocket()
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(registerAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false
        applyAuthSuccess(
          state,
          action.payload.user,
          action.payload.accessToken,
          action.payload.refreshToken,
        )
        connectSocket()
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(loadUserAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadUserAsync.fulfilled, (state, action) => {
        state.loading = false
        state.isInitialized = true
        state.user = action.payload
        state.isAuthenticated = true
        connectSocket()
      })
      .addCase(loadUserAsync.rejected, (state) => {
        state.loading = false
        state.isInitialized = true
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
      })
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.error = action.payload as string
      })
  },
})

export const { clearAuthError, setTokensFromRefresh, resetAuth } = authSlice.actions
export default authSlice.reducer
