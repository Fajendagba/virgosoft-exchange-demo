import api from './api'
import type { ApiResponse, LoginResponse } from '@/types'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
    return data
  },

  async register(credentials: RegisterCredentials) {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/register', credentials)
    return data
  },

  async logout() {
    const { data } = await api.post<ApiResponse>('/auth/logout')
    return data
  },
}
