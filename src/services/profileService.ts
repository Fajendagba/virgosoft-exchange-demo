import api from './api'
import type { ApiResponse, ProfileResponse } from '@/types'

export const profileService = {
  async getProfile() {
    const { data } = await api.get<ApiResponse<ProfileResponse>>('/profile')
    return data
  },
}
