<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import type { Order, Symbol } from '@/types'
import { ORDER_STATUS } from '@/types'

interface Props {
  orders: Order[]
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'order-cancelled'): void
}>()

const orderStore = useOrderStore()

const filterSymbol = ref<Symbol | 'ALL'>('ALL')
const filterStatus = ref<number | 'ALL'>('ALL')

const filteredOrders = computed(() => {
  let result = [...props.orders]

  if (filterSymbol.value !== 'ALL') {
    result = result.filter(order => order.symbol === filterSymbol.value)
  }

  if (filterStatus.value !== 'ALL') {
    result = result.filter(order => order.status === filterStatus.value)
  }

  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

const getStatusLabel = (status: number) => {
  switch (status) {
    case ORDER_STATUS.OPEN:
      return 'Open'
    case ORDER_STATUS.FILLED:
      return 'Filled'
    case ORDER_STATUS.CANCELLED:
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}

const getStatusClass = (status: number) => {
  switch (status) {
    case ORDER_STATUS.OPEN:
      return 'bg-blue-100 text-blue-800'
    case ORDER_STATUS.FILLED:
      return 'bg-green-100 text-green-800'
    case ORDER_STATUS.CANCELLED:
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatPrice = (price: string) => {
  return parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatAmount = (amount: string) => {
  return parseFloat(amount).toFixed(8)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleCancelOrder = async (orderId: string, symbol: Symbol) => {
  if (!confirm('Are you sure you want to cancel this order?')) {
    return
  }

  try {
    await orderStore.cancelOrder(orderId, symbol)
    emit('order-cancelled')
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    alert(error.response?.data?.message || 'Failed to cancel order')
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Your Orders</h2>

    <div class="mb-4 flex gap-2">
      <select
        v-model="filterSymbol"
        class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
      >
        <option value="ALL">All Symbols</option>
        <option value="BTC">BTC</option>
        <option value="ETH">ETH</option>
      </select>

      <select
        v-model="filterStatus"
        class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
      >
        <option value="ALL">All Status</option>
        <option :value="ORDER_STATUS.OPEN">Open</option>
        <option :value="ORDER_STATUS.FILLED">Filled</option>
        <option :value="ORDER_STATUS.CANCELLED">Cancelled</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-8 text-gray-500">
      Loading...
    </div>

    <div v-else-if="filteredOrders.length === 0" class="text-center py-8 text-gray-500">
      No orders found
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Side</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-3 py-2 text-sm text-gray-500">{{ formatDate(order.created_at) }}</td>
            <td class="px-3 py-2 text-sm font-medium text-gray-900">{{ order.symbol }}</td>
            <td class="px-3 py-2 text-sm">
              <span
                :class="order.side === 'buy' ? 'text-green-600' : 'text-red-600'"
                class="font-medium uppercase"
              >
                {{ order.side }}
              </span>
            </td>
            <td class="px-3 py-2 text-sm text-gray-900">${{ formatPrice(order.price) }}</td>
            <td class="px-3 py-2 text-sm text-gray-900">{{ formatAmount(order.amount) }}</td>
            <td class="px-3 py-2 text-sm text-gray-900">${{ formatPrice(order.total) }}</td>
            <td class="px-3 py-2 text-sm">
              <span
                :class="getStatusClass(order.status)"
                class="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
              >
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td class="px-3 py-2 text-sm">
              <button
                v-if="order.status === ORDER_STATUS.OPEN"
                @click="handleCancelOrder(order.id, order.symbol as Symbol)"
                class="text-red-600 hover:text-red-800 font-medium"
              >
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
