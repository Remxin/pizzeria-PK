export const AUTH_ACCESS_TOKEN_KEY = 'auth_access_token'
export const AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token'
export const CART_STORAGE_KEY = 'cart_items'

export function getAccessToken(): string | null {
  return localStorage.getItem(AUTH_ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(AUTH_REFRESH_TOKEN_KEY)
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(AUTH_ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(AUTH_ACCESS_TOKEN_KEY)
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY)
}

export function hasStoredSession(): boolean {
  return Boolean(getAccessToken() && getRefreshToken())
}
