import type { PaginatedResponse } from '../types/api.types'
import type { Product } from '../types/product.types'
import { api } from './api'

export interface ProductQuery {
  page?: number
  limit?: number
  categoryId?: number
  isAvailable?: boolean
  search?: string
}

export interface CreateProductPayload {
  categoryId: number
  name: string
  description?: string
  basePrice: number
  imageUrl?: string
  isAvailable?: boolean
}

export type UpdateProductPayload = Partial<CreateProductPayload>

export const productsService = {
  async getAll(query?: ProductQuery): Promise<PaginatedResponse<Product>> {
    const { data } = await api.get<PaginatedResponse<Product>>('/products', { params: query })
    return data
  },

  async getById(id: number): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${id}`)
    return data
  },

  async create(payload: CreateProductPayload): Promise<Product> {
    const { data } = await api.post<Product>('/products', payload)
    return data
  },

  async update(id: number, payload: UpdateProductPayload): Promise<Product> {
    const { data } = await api.patch<Product>(`/products/${id}`, payload)
    return data
  },

  async delete(id: number): Promise<Product> {
    const { data } = await api.delete<Product>(`/products/${id}`)
    return data
  },
}
