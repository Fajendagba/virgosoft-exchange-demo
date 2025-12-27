<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import type { Symbol, Side } from '@/types'

interface Props {
  selectedSymbol: Symbol
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'symbol-change', symbol: Symbol): void
  (e: 'order-created'): void
}>()

const orderStore = useOrderStore()

const symbol = ref<Symbol>(props.selectedSymbol)
const side = ref<Side>('buy')
const price = ref('')
const amount = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const total = computed(() => {
  const p = parseFloat(price.value)
  const a = parseFloat(amount.value)
  if (isNaN(p) || isNaN(a)) return '0.00'
  return (p * a).toFixed(2)
})

const handleSymbolChange = () => {
  emit('symbol-change', symbol.value)
}

const resetForm = () => {
  price.value = ''
  amount.value = ''
  errorMessage.value = ''
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!price.value || !amount.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  const priceNum = parseFloat(price.value)
  const amountNum = parseFloat(amount.value)

  if (priceNum <= 0 || amountNum <= 0) {
    errorMessage.value = 'Price and amount must be greater than 0'
    return
  }

  try {
    await orderStore.createOrder(symbol.value, side.value, price.value, amount.value)
    successMessage.value = `${side.value.toUpperCase()} order placed successfully`
    emit('order-created')
    resetForm()

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    errorMessage.value = error.response?.data?.message || 'Failed to place order'
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Place Limit Order</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-3">
        <p class="text-sm text-red-800">{{ errorMessage }}</p>
      </div>

      <div v-if="successMessage" class="rounded-md bg-green-50 p-3">
        <p class="text-sm text-green-800">{{ successMessage }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="symbol" class="block text-sm font-medium text-gray-700 mb-1">
            Symbol
          </label>
          <select
            id="symbol"
            v-model="symbol"
            @change="handleSymbolChange"
            class="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>
        </div>

        <div>
          <label for="side" class="block text-sm font-medium text-gray-700 mb-1">
            Side
          </label>
          <select
            id="side"
            v-model="side"
            class="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
            Price (USD)
          </label>
          <input
            id="price"
            v-model="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            class="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
            Amount ({{ symbol }})
          </label>
          <input
            id="amount"
            v-model="amount"
            type="number"
            step="0.00000001"
            placeholder="0.00000000"
            class="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div class="bg-gray-50 rounded-md p-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Total:</span>
          <span class="font-semibold text-gray-900">${{ total }}</span>
        </div>
      </div>

      <button
        type="submit"
        :disabled="orderStore.loading"
        :class="[
          'w-full rounded-md py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          side === 'buy'
            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        ]"
      >
        {{ orderStore.loading ? 'Placing Order...' : `Place ${side.toUpperCase()} Order` }}
      </button>
    </form>
  </div>
</template>
