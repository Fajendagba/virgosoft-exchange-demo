<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'
import { useOrderStore } from '@/stores/orderStore'
import { getEcho } from '@/services/echoService'
import WalletOverview from '@/components/WalletOverview.vue'
import OrderForm from '@/components/OrderForm.vue'
import Orderbook from '@/components/Orderbook.vue'
import UserOrders from '@/components/UserOrders.vue'
import type { OrderMatchedEvent, Symbol } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const profileStore = useProfileStore()
const orderStore = useOrderStore()

const selectedSymbol = ref<Symbol>('BTC')
const successMessage = ref('')
const errorMessage = ref('')

const user = computed(() => authStore.user)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleSymbolChange = (symbol: Symbol) => {
  selectedSymbol.value = symbol
  loadOrderbook()
}

const loadOrderbook = async () => {
  try {
    await orderStore.fetchOrderbook(selectedSymbol.value)
  } catch (err) {
    console.error('Failed to load orderbook:', err)
  }
}

const loadData = async () => {
  try {
    await Promise.all([
      profileStore.fetchProfile(),
      orderStore.fetchUserOrders(),
      loadOrderbook(),
    ])
  } catch (err) {
    console.error('Failed to load data:', err)
  }
}

const handleOrderMatched = (event: OrderMatchedEvent) => {
  profileStore.fetchProfile()
  orderStore.fetchUserOrders()
  orderStore.fetchOrderbook(selectedSymbol.value)

  successMessage.value = `Trade executed: ${event.amount} ${event.symbol} @ $${event.price}`
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

onMounted(() => {
  loadData()

  const echo = getEcho()
  if (echo && user.value) {
    (echo.private(`user.${user.value.id}`) as any)
      .listen('OrderMatched', handleOrderMatched)
  }
})

onUnmounted(() => {
  const echo = getEcho()
  if (echo && user.value) {
    echo.leave(`user.${user.value.id}`)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between items-center">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Virgosoft Exchange</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ user?.name }}</span>
            <button
              @click="handleLogout"
              class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="successMessage" class="mb-4 rounded-md bg-green-50 p-4">
        <p class="text-sm text-green-800">{{ successMessage }}</p>
      </div>

      <div v-if="errorMessage" class="mb-4 rounded-md bg-red-50 p-4">
        <p class="text-sm text-red-800">{{ errorMessage }}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="lg:col-span-1">
          <WalletOverview />
        </div>
        <div class="lg:col-span-2">
          <OrderForm
            :selected-symbol="selectedSymbol"
            @symbol-change="handleSymbolChange"
            @order-created="loadData"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Orderbook
            :symbol="selectedSymbol"
            :buy-orders="orderStore.buyOrders"
            :sell-orders="orderStore.sellOrders"
            :loading="orderStore.loading"
          />
        </div>
        <div>
          <UserOrders
            :orders="orderStore.userOrders"
            :loading="orderStore.loading"
            @order-cancelled="loadData"
          />
        </div>
      </div>
    </main>
  </div>
</template>
