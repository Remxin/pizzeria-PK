import { api } from './api'

export interface DateRangeQuery {
  startDate?: string
  endDate?: string
}

export interface PopularProduct {
  productId: number
  name: string
  totalQuantity: number
  totalRevenue: number | string
}

export interface SalesPeriodItem {
  period: string
  orderCount: number
  revenue: number | string
}

export const analyticsService = {
  async getPopularProducts(query?: DateRangeQuery): Promise<PopularProduct[]> {
    const { data } = await api.get<PopularProduct[]>('/analytics/products/popular', {
      params: query,
    })
    return data
  },

  async getSalesByPeriod(query?: DateRangeQuery & { period?: 'day' | 'week' | 'month' }) {
    const { data } = await api.get<SalesPeriodItem[]>('/analytics/sales/period', {
      params: query,
    })
    return data
  },
}
