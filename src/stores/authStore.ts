import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { initializeEcho, disconnectEcho } from '@/services/echoService'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      initializeEcho(storedToken)
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login({ email, password })

      user.value = response.data.user
      token.value = response.data.token

      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      initializeEcho(response.data.token)

      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })

      user.value = response.data.user
      token.value = response.data.token

      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      initializeEcho(response.data.token)

      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      disconnectEcho()
    }
  }

  const updateUser = (updatedUser: User) => {
    user.value = updatedUser
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    initializeAuth,
    login,
    register,
    logout,
    updateUser,
  }
})
