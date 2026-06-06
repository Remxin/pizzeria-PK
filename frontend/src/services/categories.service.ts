import type { Category, CategoryType } from '../types/product.types'
import { api } from './api'

export interface CategoryQuery {
  type?: CategoryType
}

export interface CreateCategoryPayload {
  name: string
  description?: string
  type: CategoryType
  displayOrder?: number
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>

export const categoriesService = {
  async getAll(query?: CategoryQuery): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories', { params: query })
    return data
  },

  async getById(id: number): Promise<Category> {
    const { data } = await api.get<Category>(`/categories/${id}`)
    return data
  },

  async create(payload: CreateCategoryPayload): Promise<Category> {
    const { data } = await api.post<Category>('/categories', payload)
    return data
  },

  async update(id: number, payload: UpdateCategoryPayload): Promise<Category> {
    const { data } = await api.patch<Category>(`/categories/${id}`, payload)
    return data
  },

  async delete(id: number): Promise<Category> {
    const { data } = await api.delete<Category>(`/categories/${id}`)
    return data
  },
}
