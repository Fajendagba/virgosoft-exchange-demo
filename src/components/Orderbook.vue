<script setup lang="ts">
import { computed } from 'vue'
import type { Order, Symbol } from '@/types'

interface Props {
  symbol: Symbol
  buyOrders: Order[]
  sellOrders: Order[]
  loading: boolean
}

const props = defineProps<Props>()

const formatPrice = (price: string) => {
  return parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatAmount = (amount: string) => {
  return parseFloat(amount).toFixed(8)
}

const sortedBuyOrders = computed(() => {
  return [...props.buyOrders].sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
})

const sortedSellOrders = computed(() => {
  return [...props.sellOrders].sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
})
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Orderbook - {{ symbol }}</h2>

    <div v-if="loading" class="text-center py-8 text-gray-500">
      Loading...
    </div>

    <div v-else class="space-y-6">
      <div>
        <h3 class="text-sm font-medium text-red-600 mb-2">Sell Orders</h3>
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price (USD)</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="sortedSellOrders.length === 0">
                <td colspan="3" class="px-3 py-4 text-sm text-gray-500 text-center">
                  No sell orders
                </td>
              </tr>
              <tr v-for="order in sortedSellOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-3 py-2 text-sm text-red-600 font-medium">${{ formatPrice(order.price) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900">{{ formatAmount(order.amount) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900">${{ formatPrice(order.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="border-t pt-4">
        <h3 class="text-sm font-medium text-green-600 mb-2">Buy Orders</h3>
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price (USD)</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="sortedBuyOrders.length === 0">
                <td colspan="3" class="px-3 py-4 text-sm text-gray-500 text-center">
                  No buy orders
                </td>
              </tr>
              <tr v-for="order in sortedBuyOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-3 py-2 text-sm text-green-600 font-medium">${{ formatPrice(order.price) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900">{{ formatAmount(order.amount) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900">${{ formatPrice(order.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
