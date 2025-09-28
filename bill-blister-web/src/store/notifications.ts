import { create } from 'zustand'
import { Notification, ToastMessage } from '@/types'

interface NotificationStore {
  notifications: Notification[]
  toasts: ToastMessage[]
  unreadCount: number
  isLoading: boolean
  
  // Notification actions
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  removeNotification: (notificationId: string) => void
  clearAllNotifications: () => void
  setLoading: (loading: boolean) => void
  
  // Toast actions
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (toastId: string) => void
  clearAllToasts: () => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  toasts: [],
  unreadCount: 0,
  isLoading: false,

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter(n => !n.isRead).length
    set({ notifications, unreadCount })
  },

  addNotification: (notification) => {
    const { notifications } = get()
    const newNotifications = [notification, ...notifications]
    const unreadCount = newNotifications.filter(n => !n.isRead).length
    set({ notifications: newNotifications, unreadCount })
  },

  markAsRead: (notificationId) => {
    const { notifications } = get()
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    )
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length
    set({ notifications: updatedNotifications, unreadCount })
  },

  markAllAsRead: () => {
    const { notifications } = get()
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true,
    }))
    set({ notifications: updatedNotifications, unreadCount: 0 })
  },

  removeNotification: (notificationId) => {
    const { notifications } = get()
    const filteredNotifications = notifications.filter(n => n.id !== notificationId)
    const unreadCount = filteredNotifications.filter(n => !n.isRead).length
    set({ notifications: filteredNotifications, unreadCount })
  },

  clearAllNotifications: () => {
    set({ notifications: [], unreadCount: 0 })
  },

  setLoading: (loading) => {
    set({ isLoading: loading })
  },

  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    }
    
    const { toasts } = get()
    set({ toasts: [...toasts, newToast] })

    // Auto remove toast after duration
    setTimeout(() => {
      get().removeToast(id)
    }, newToast.duration)
  },

  removeToast: (toastId) => {
    const { toasts } = get()
    set({ toasts: toasts.filter(toast => toast.id !== toastId) })
  },

  clearAllToasts: () => {
    set({ toasts: [] })
  },
}))
