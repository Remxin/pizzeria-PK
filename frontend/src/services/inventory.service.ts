import type { Ingredient } from '../types/product.types'
import { api } from './api'

export interface StockAdjustmentPayload {
  ingredientId: number
  adjustment: number
  reason?: string
}

export const inventoryService = {
  async adjustStock(payload: StockAdjustmentPayload): Promise<Ingredient> {
    const { data } = await api.post<Ingredient>('/inventory/adjust', payload)
    return data
  },

  async getLowStockAlerts(): Promise<Ingredient[]> {
    const { data } = await api.get<Ingredient[]>('/inventory/alerts')
    return data
  },
}
