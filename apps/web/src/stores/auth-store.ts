import { AxiosError } from 'axios'
import { create } from 'zustand'

import { api } from '../http/api/axios'
import { SignUpFormData } from '../schemas/auth'
import { ErrorResponse } from '../types'

type User = {
  id: string
  name: string
  email: string | null
  avatarUrl: string | null
}

type AuthStore = {
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: AxiosError<ErrorResponse> | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  signUp: (payload: SignUpFormData) => Promise<void>
  checkAuth: () => Promise<void>
  setAccessToken: (token: string | null) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null })
      const { data } = await api.post('/sessions/password', { email, password })

      set({
        accessToken: data.accessToken,
        isAuthenticated: true,
      })

      await get().checkAuth()
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data?.message || 'Falha no login' })
      }
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  signUp: async (payload: SignUpFormData) => {
    try {
      set({ isLoading: true })
      await api.post('/sign-up', payload)
      await get().login(payload.email, payload.password)
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data?.message || 'Falha no cadastro' })
      }
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true })
      const { data } = await api.get('/profile')
      set({ user: data.user })
    } catch (error) {
      await get().logout()
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  setAccessToken: (token) =>
    set({
      accessToken: token,
      isAuthenticated: !!token,
    }),

  logout: async () => {
    try {
      await api.post('/sessions/logout')
    } finally {
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        error: null,
      })
      localStorage.removeItem('selectedOrg')
    }
  },
}))
