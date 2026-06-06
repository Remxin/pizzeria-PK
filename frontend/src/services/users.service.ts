import type { Order } from '../types/order.types'
import type { User, UserRole } from '../types/user.types'
import { api } from './api'

export interface UpdateProfilePayload {
  fullName?: string
  phone?: string
  address?: string
}

export interface CreateEmployeePayload {
  email: string
  password: string
  role: Extract<UserRole, 'EMPLOYEE' | 'ADMIN'>
  fullName?: string
  phone?: string
}

export const usersService = {
  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/users/me')
    return data
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await api.patch<User>('/users/me', payload)
    return data
  },

  async getMyOrders(): Promise<Order[]> {
    const { data } = await api.get<Order[]>('/users/me/orders')
    return data
  },

  async createEmployee(payload: CreateEmployeePayload): Promise<User> {
    const { data } = await api.post<User>('/users/employee', payload)
    return data
  },
}
