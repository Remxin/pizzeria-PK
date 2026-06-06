import type { CustomPizza } from '../types/product.types'
import { api } from './api'

export interface CustomPizzaIngredientPayload {
  ingredientId: number
  quantity: number
}

export interface CreateCustomPizzaPayload {
  name?: string
  ingredients: CustomPizzaIngredientPayload[]
}

export type UpdateCustomPizzaPayload = Partial<CreateCustomPizzaPayload>

export const customPizzaService = {
  async create(payload: CreateCustomPizzaPayload): Promise<CustomPizza> {
    const { data } = await api.post<CustomPizza>('/custom-pizzas', payload)
    return data
  },

  async getAll(): Promise<CustomPizza[]> {
    const { data } = await api.get<CustomPizza[]>('/custom-pizzas')
    return data
  },

  async getById(id: number): Promise<CustomPizza> {
    const { data } = await api.get<CustomPizza>(`/custom-pizzas/${id}`)
    return data
  },

  async update(id: number, payload: UpdateCustomPizzaPayload): Promise<CustomPizza> {
    const { data } = await api.patch<CustomPizza>(`/custom-pizzas/${id}`, payload)
    return data
  },

  async delete(id: number): Promise<CustomPizza> {
    const { data } = await api.delete<CustomPizza>(`/custom-pizzas/${id}`)
    return data
  },
}
