import type { PaginatedResponse } from '../types/api.types'
import type { Ingredient } from '../types/product.types'
import { api } from './api'

export interface IngredientQuery {
  page?: number
  limit?: number
  categoryId?: number
  isAvailable?: boolean
  lowStock?: boolean
  search?: string
}

export interface CreateIngredientPayload {
  categoryId: number
  name: string
  unitCost: number
  priceForClient: number
  stockQuantity?: number
  alertThreshold?: number
  unit?: string
  imageUrl?: string
  defaultSize?: number
  isAvailable?: boolean
}

export type UpdateIngredientPayload = Partial<CreateIngredientPayload>

export const ingredientsService = {
  async getAll(query?: IngredientQuery): Promise<PaginatedResponse<Ingredient>> {
    const { data } = await api.get<PaginatedResponse<Ingredient>>('/ingredients', {
      params: query,
    })
    return data
  },

  async getById(id: number): Promise<Ingredient> {
    const { data } = await api.get<Ingredient>(`/ingredients/${id}`)
    return data
  },

  async getLowStockAlerts(): Promise<Ingredient[]> {
    const { data } = await api.get<Ingredient[]>('/ingredients/alerts/low-stock')
    return data
  },

  async create(payload: CreateIngredientPayload): Promise<Ingredient> {
    const { data } = await api.post<Ingredient>('/ingredients', payload)
    return data
  },

  async update(id: number, payload: UpdateIngredientPayload): Promise<Ingredient> {
    const { data } = await api.patch<Ingredient>(`/ingredients/${id}`, payload)
    return data
  },

  async delete(id: number): Promise<Ingredient> {
    const { data } = await api.delete<Ingredient>(`/ingredients/${id}`)
    return data
  },
}
