import api from './api'
import type { ApiResponse, OrderbookResponse, OrdersResponse, OrderResponse, Symbol, Side } from '@/types'

interface CreateOrderPayload {
  symbol: Symbol
  side: Side
  price: string
  amount: string
}

export const orderService = {
  async getOrderbook(symbol: Symbol) {
    const { data } = await api.get<ApiResponse<OrderbookResponse>>(`/orders?symbol=${symbol}`)
    return data
  },

  async getUserOrders() {
    const { data } = await api.get<ApiResponse<OrdersResponse>>('/orders/me')
    return data
  },

  async createOrder(payload: CreateOrderPayload) {
    const { data } = await api.post<ApiResponse<OrderResponse>>('/orders', payload)
    return data
  },

  async cancelOrder(orderId: string) {
    const { data } = await api.post<ApiResponse<OrderResponse>>(`/orders/${orderId}/cancel`)
    return data
  },
}
