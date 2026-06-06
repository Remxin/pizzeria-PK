import type { AuthResponse, TokenPair } from '../types/api.types'
import type { User } from '../types/user.types'
import { api } from './api'

export interface RegisterPayload {
  email: string
  password: string
  fullName?: string
  phone?: string
  address?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload)
    return data
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    return data
  },

  async refresh(refreshToken: string): Promise<TokenPair> {
    const { data } = await api.post<TokenPair>('/auth/refresh', { refreshToken })
    return data
  },

  async logout(refreshToken?: string): Promise<void> {
    await api.post('/auth/logout', refreshToken ? { refreshToken } : {})
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>('/users/me')
    return data
  },
}
