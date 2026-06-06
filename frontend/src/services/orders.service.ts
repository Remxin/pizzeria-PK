import type { PaginatedResponse } from '../types/api.types'
import type { CreateOrderPayload, Order, OrderStatus } from '../types/order.types'
import { api } from './api'

export interface OrderQuery {
  page?: number
  limit?: number
  status?: OrderStatus
  userId?: number
  startDate?: string
  endDate?: string
}

export const ordersService = {
  async create(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await api.post<Order>('/orders', payload)
    return data
  },

  async getAll(query?: OrderQuery): Promise<PaginatedResponse<Order>> {
    const { data } = await api.get<PaginatedResponse<Order>>('/orders', { params: query })
    return data
  },

  async getById(id: number): Promise<Order> {
    const { data } = await api.get<Order>(`/orders/${id}`)
    return data
  },

  async getUserOrders(userId: number): Promise<Order[]> {
    const { data } = await api.get<Order[]>(`/orders/user/${userId}`)
    return data
  },

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const { data } = await api.patch<Order>(`/orders/${id}/status`, { status })
    return data
  },
}
