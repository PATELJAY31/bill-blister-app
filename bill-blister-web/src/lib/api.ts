import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refreshToken,
          })
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  signup: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    role?: string
    phone?: string
    reportingManagerId?: number
  }) => api.post('/auth/signup', userData),
  
  getProfile: () => api.get('/auth/profile'),
  
  updateProfile: (userData: any) => api.put('/auth/profile', userData),
  
  changePassword: (passwordData: {
    currentPassword: string
    newPassword: string
  }) => api.put('/auth/change-password', passwordData),
  
  logout: () => api.post('/auth/logout'),
}

export const employeesAPI = {
  getAll: (params?: any) => api.get('/employees', { params }),
  
  getById: (id: number) => api.get(`/employees/${id}`),
  
  create: (employeeData: any) => api.post('/employees', employeeData),
  
  update: (id: number, employeeData: any) => api.put(`/employees/${id}`, employeeData),
  
  delete: (id: number) => api.delete(`/employees/${id}`),
}

export const expenseTypesAPI = {
  getAll: (params?: any) => api.get('/expense-types', { params }),
  
  getById: (id: number) => api.get(`/expense-types/${id}`),
  
  create: (expenseTypeData: any) => api.post('/expense-types', expenseTypeData),
  
  update: (id: number, expenseTypeData: any) => api.put(`/expense-types/${id}`, expenseTypeData),
  
  delete: (id: number) => api.delete(`/expense-types/${id}`),
}

export const allocationsAPI = {
  getAll: (params?: any) => api.get('/allocations', { params }),
  
  getById: (id: number) => api.get(`/allocations/${id}`),
  
  create: (allocationData: any) => api.post('/allocations', allocationData),
  
  update: (id: number, allocationData: any) => api.put(`/allocations/${id}`, allocationData),
  
  delete: (id: number) => api.delete(`/allocations/${id}`),
}

export const claimsAPI = {
  getAll: (params?: any) => api.get('/claims', { params }),
  
  getById: (id: number) => api.get(`/claims/${id}`),
  
  create: (claimData: any) => api.post('/claims', claimData),
  
  update: (id: number, claimData: any) => api.put(`/claims/${id}`, claimData),
  
  delete: (id: number) => api.delete(`/claims/${id}`),
  
  verify: (id: number, verificationData: { status: string; notes?: string }) =>
    api.post(`/claims/${id}/verify`, verificationData),
  
  approve: (id: number, approvalData: { status: string; notes?: string }) =>
    api.post(`/claims/${id}/approve`, approvalData),
}

export const notificationsAPI = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  
  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),
  
  markAllAsRead: () => api.put('/notifications/read-all'),
  
  delete: (id: number) => api.delete(`/notifications/${id}`),
}

export const reportsAPI = {
  getDashboardStats: () => api.get('/reports/dashboard'),
  
  getClaimsReport: (params?: any) => api.get('/reports/claims', { params }),
  
  getAllocationsReport: (params?: any) => api.get('/reports/allocations', { params }),
  
  getEmployeeReport: (employeeId: number, params?: any) =>
    api.get(`/reports/employees/${employeeId}`, { params }),
  
  exportToPDF: (params?: any) => api.get('/reports/export/pdf', { params, responseType: 'blob' }),
  
  exportToExcel: (params?: any) => api.get('/reports/export/excel', { params, responseType: 'blob' }),
}

export default api
