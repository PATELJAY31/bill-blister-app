import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, User } from '@/types'
import { authAPI } from '@/lib/api'

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    role?: string
    phone?: string
    reportingManagerId?: number
  }) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  setLoading: (loading: boolean) => void
  refreshProfile: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          const response = await authAPI.login({ email, password })
          const { user, accessToken, refreshToken } = response.data.data
          
          // Store tokens
          localStorage.setItem('accessToken', accessToken)
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken)
          }
          
          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          console.error('Login failed:', error)
          set({ isLoading: false })
          throw error
        }
      },

      signup: async (userData) => {
        set({ isLoading: true })
        
        try {
          const response = await authAPI.signup(userData)
          const { user, accessToken, refreshToken } = response.data.data
          
          // Store tokens
          localStorage.setItem('accessToken', accessToken)
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken)
          }
          
          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          console.error('Signup failed:', error)
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await authAPI.logout()
        } catch (error) {
          // Ignore logout errors
        } finally {
          // Clear tokens and state
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          })
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      refreshProfile: async () => {
        try {
          const response = await authAPI.getProfile()
          const { user } = response.data.data
          set({ user })
        } catch (error) {
          // If profile refresh fails, logout user
          get().logout()
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
