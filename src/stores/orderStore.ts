import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderService } from '@/services/orderService'
import type { Order, Symbol, Side } from '@/types'

export const useOrderStore = defineStore('order', () => {
  const userOrders = ref<Order[]>([])
  const buyOrders = ref<Order[]>([])
  const sellOrders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUserOrders = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await orderService.getUserOrders()
      userOrders.value = response.data.orders
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch orders'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchOrderbook = async (symbol: Symbol) => {
    loading.value = true
    error.value = null

    try {
      const response = await orderService.getOrderbook(symbol)
      buyOrders.value = response.data.buy_orders
      sellOrders.value = response.data.sell_orders
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch orderbook'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createOrder = async (symbol: Symbol, side: Side, price: string, amount: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await orderService.createOrder({ symbol, side, price, amount })
      await fetchUserOrders()
      await fetchOrderbook(symbol)
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to create order'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelOrder = async (orderId: string, symbol: Symbol) => {
    loading.value = true
    error.value = null

    try {
      const response = await orderService.cancelOrder(orderId)
      await fetchUserOrders()
      await fetchOrderbook(symbol)
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to cancel order'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateOrderStatus = (orderId: string, status: 1 | 2 | 3) => {
    const order = userOrders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
    }
  }

  return {
    userOrders,
    buyOrders,
    sellOrders,
    loading,
    error,
    fetchUserOrders,
    fetchOrderbook,
    createOrder,
    cancelOrder,
    updateOrderStatus,
  }
})
