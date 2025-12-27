import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profileService } from '@/services/profileService'
import { useAuthStore } from './authStore'
import type { Asset } from '@/types'

export const useProfileStore = defineStore('profile', () => {
  const assets = ref<Asset[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProfile = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await profileService.getProfile()
      const authStore = useAuthStore()

      authStore.updateUser(response.data.user)
      assets.value = response.data.assets

      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getAssetBySymbol = (symbol: string) => {
    return assets.value.find(asset => asset.symbol === symbol)
  }

  const updateAssets = (newAssets: Asset[]) => {
    assets.value = newAssets
  }

  return {
    assets,
    loading,
    error,
    fetchProfile,
    getAssetBySymbol,
    updateAssets,
  }
})
