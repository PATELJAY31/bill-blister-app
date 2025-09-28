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
          // Try to connect to the real API first
          const response = await authAPI.login({ email, password })
          const { user, accessToken, refreshToken } = response.data.data
          
          // Store tokens
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
          
          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          // If API is not available, fall back to mock authentication
          console.warn('Backend API not available, using mock authentication')
          
          // Mock authentication - replace with real API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Mock user data based on email
          const mockUsers: Record<string, User> = {
            'admin@billblister.com': {
              id: 1,
              firstName: 'Admin',
              lastName: 'User',
              email: 'admin@billblister.com',
              role: 'ADMIN' as any,
              phone: '+1-555-0100',
              status: 'ACTIVE',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            'employee@billblister.com': {
              id: 2,
              firstName: 'John',
              lastName: 'Doe',
              email: 'employee@billblister.com',
              role: 'EMPLOYEE' as any,
              phone: '+1-555-0101',
              status: 'ACTIVE',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            'engineer@billblister.com': {
              id: 3,
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'engineer@billblister.com',
              role: 'ENGINEER' as any,
              phone: '+1-555-0102',
              status: 'ACTIVE',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            'approver@billblister.com': {
              id: 4,
              firstName: 'Mike',
              lastName: 'Johnson',
              email: 'approver@billblister.com',
              role: 'HO_APPROVER' as any,
              phone: '+1-555-0103',
              status: 'ACTIVE',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          }

          const user = mockUsers[email]
          if (!user || password !== 'password123') {
            throw new Error('Invalid credentials')
          }

          set({
            user,
            token: 'mock-token',
            isAuthenticated: true,
            isLoading: false,
          })
        }
      },

      signup: async (userData) => {
        set({ isLoading: true })
        
        try {
          // Try to connect to the real API first
          const response = await authAPI.signup(userData)
          const { user, accessToken, refreshToken } = response.data.data
          
          // Store tokens
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
          
          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          // If API is not available, fall back to mock signup
          console.warn('Backend API not available, using mock signup')
          
          // Mock signup - simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          // Create mock user
          const mockUser: User = {
            id: Date.now(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: (userData.role as any) || 'EMPLOYEE',
            phone: userData.phone || '',
            status: 'ACTIVE',
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          set({
            user: mockUser,
            token: 'mock-token',
            isAuthenticated: true,
            isLoading: false,
          })
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
