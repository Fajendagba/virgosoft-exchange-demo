export interface User {
  id: string
  name: string
  email: string
  balance: string
  created_at: string
}

export interface Asset {
  id: string
  symbol: string
  amount: string
  locked_amount: string
  available: string
}

export interface Order {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  price: string
  amount: string
  total: string
  status: 1 | 2 | 3
  created_at: string
  updated_at: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface ProfileResponse {
  user: User
  assets: Asset[]
}

export interface OrderbookResponse {
  buy_orders: Order[]
  sell_orders: Order[]
}

export interface OrdersResponse {
  orders: Order[]
}

export interface OrderResponse {
  order: Order
}

export interface OrderMatchedEvent {
  trade_id: string
  buyer_id: string
  seller_id: string
  symbol: string
  price: string
  amount: string
  total: string
  commission: string
  matched_at: string
}

export type OrderStatus = 1 | 2 | 3

export const ORDER_STATUS = {
  OPEN: 1,
  FILLED: 2,
  CANCELLED: 3,
} as const

export type Symbol = 'BTC' | 'ETH'
export type Side = 'buy' | 'sell'
