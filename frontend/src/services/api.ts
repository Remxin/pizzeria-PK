import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, TokenPair } from '../types/api.types'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '../utils/authStorage'

function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
  const trimmed = raw.replace(/\/$/, '')

  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const API_URL = resolveApiBaseUrl()

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let refreshQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

let onSessionExpired: (() => void) | null = null
let onTokensRefreshed: ((tokens: TokenPair) => void) | null = null

export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler
}

export function setTokensRefreshedHandler(handler: (tokens: TokenPair) => void): void {
  onTokensRefreshed = handler
}

function processRefreshQueue(error: unknown, token: string | null = null): void {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
      return
    }

    resolve(token!)
  })

  refreshQueue = []
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiResponse<unknown>

    if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
      return { ...response, data: payload.data }
    }

    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh')

    if (isAuthEndpoint) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      clearTokens()
      onSessionExpired?.()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const response = await axios.post<ApiResponse<TokenPair>>(
        `${API_URL}/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      )

      const tokens = response.data.data
      setTokens(tokens.accessToken, tokens.refreshToken)
      onTokensRefreshed?.(tokens)
      processRefreshQueue(null, tokens.accessToken)

      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      processRefreshQueue(refreshError, null)
      clearTokens()
      onSessionExpired?.()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
