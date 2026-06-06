import axios from 'axios'
import type { ApiError } from '../types/api.types'

export function getApiErrorMessage(error: unknown, fallback = 'Wystąpił nieoczekiwany błąd'): string {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
