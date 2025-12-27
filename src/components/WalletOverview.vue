<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'

const authStore = useAuthStore()
const profileStore = useProfileStore()

const balance = computed(() => {
  const bal = parseFloat(authStore.user?.balance || '0')
  return bal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

const assets = computed(() => profileStore.assets)

const formatAmount = (amount: string) => {
  const num = parseFloat(amount)
  return num.toFixed(8)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Wallet</h2>

    <div class="space-y-4">
      <div class="border-b pb-4">
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-600">USD Balance</span>
          <span class="text-lg font-bold text-gray-900">${{ balance }}</span>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-medium text-gray-700 mb-3">Assets</h3>
        <div v-if="assets.length === 0" class="text-sm text-gray-500">
          No assets yet
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="asset in assets"
            :key="asset.id"
            class="flex justify-between items-start"
          >
            <div>
              <div class="font-medium text-gray-900">{{ asset.symbol }}</div>
              <div class="text-xs text-gray-500">
                Locked: {{ formatAmount(asset.locked_amount) }}
              </div>
            </div>
            <div class="text-right">
              <div class="font-medium text-gray-900">{{ formatAmount(asset.amount) }}</div>
              <div class="text-xs text-gray-500">
                Available: {{ formatAmount(asset.available) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
