'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatDate, formatDateTime } from '@/lib/utils'
import { useNotificationStore } from '@/store/notifications'
import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { Notification, NotificationType } from '@/types'
import { notificationsAPI } from '@/lib/api'

const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useNotificationStore()
  const [loading, setLoading] = useState(true)

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      employeeId: '1',
      employee: {
        id: '1',
        email: 'john.doe@company.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      title: 'Claim Approved',
      message: 'Your expense claim for ₹2,500 has been approved by the engineer.',
      type: 'SUCCESS',
      isRead: false,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      employeeId: '2',
      employee: {
        id: '2',
        email: 'sarah.wilson@company.com',
        firstName: 'Sarah',
        lastName: 'Wilson',
        role: 'EMPLOYEE',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      title: 'New Allocation',
      message: 'A new cash allocation of ₹15,000 has been assigned to you for Travel expenses.',
      type: 'INFO',
      isRead: false,
      createdAt: '2024-01-15T09:15:00Z',
    },
    {
      id: '3',
      employeeId: '3',
      employee: {
        id: '3',
        email: 'mike.johnson@company.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        role: 'EMPLOYEE',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      title: 'Claim Rejected',
      message: 'Your expense claim for ₹1,200 has been rejected. Please check the rejection reason.',
      type: 'ERROR',
      isRead: true,
      createdAt: '2024-01-14T16:20:00Z',
    },
    {
      id: '4',
      employeeId: '1',
      employee: {
        id: '1',
        email: 'john.doe@company.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur on Sunday, January 21st from 2:00 AM to 4:00 AM.',
      type: 'WARNING',
      isRead: true,
      createdAt: '2024-01-13T14:00:00Z',
    },
    {
      id: '5',
      employeeId: '2',
      employee: {
        id: '2',
        email: 'sarah.wilson@company.com',
        firstName: 'Sarah',
        lastName: 'Wilson',
        role: 'EMPLOYEE',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      title: 'Claim Verification Required',
      message: 'You have 3 claims pending verification. Please review them in the verification section.',
      type: 'INFO',
      isRead: false,
      createdAt: '2024-01-12T11:45:00Z',
    },
  ]

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true)
      try {
        // Load notifications from the API
        const response = await notificationsAPI.getAll()
        // Update the store with real notifications
        // Note: This assumes the store has a method to set notifications
        console.log('Loaded notifications:', response.data.data)
      } catch (error) {
        console.error('Failed to load notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircleIcon className="w-5 h-5 text-success" />
      case 'ERROR':
        return <XCircleIcon className="w-5 h-5 text-error" />
      case 'WARNING':
        return <ExclamationTriangleIcon className="w-5 h-5 text-warning" />
      case 'INFO':
      default:
        return <InformationCircleIcon className="w-5 h-5 text-info" />
    }
  }

  const getNotificationBgColor = (type: NotificationType) => {
    switch (type) {
      case 'SUCCESS':
        return 'bg-success/10 border-success/20'
      case 'ERROR':
        return 'bg-error/10 border-error/20'
      case 'WARNING':
        return 'bg-warning/10 border-warning/20'
      case 'INFO':
      default:
        return 'bg-info/10 border-info/20'
    }
  }

  const unreadNotifications = notifications.filter(n => !n.isRead)
  const readNotifications = notifications.filter(n => n.isRead)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  if (loading) {
    return (
      <Layout title="Notifications">
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Notifications">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header Actions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">Notifications</h2>
                  <p className="text-text-secondary">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="secondary"
                      icon={<CheckIcon className="w-4 h-4" />}
                      onClick={markAllAsRead}
                    >
                      Mark All Read
                    </Button>
                  )}
                  <Button
                    variant="error"
                    icon={<TrashIcon className="w-4 h-4" />}
                    onClick={clearAllNotifications}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-warning" />
                  Unread Notifications ({unreadNotifications.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {unreadNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 hover:bg-surface-tertiary/50 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationBgColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-text-primary mb-1">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-text-secondary mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-text-tertiary">
                                {formatDateTime(notification.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <div className="w-2 h-2 bg-warning rounded-full"></div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs"
                              >
                                Mark Read
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Read Notifications */}
        {readNotifications.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-text-tertiary" />
                  Read Notifications ({readNotifications.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {readNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 hover:bg-surface-tertiary/50 transition-colors opacity-75"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationBgColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-text-primary mb-1">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-text-secondary mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-text-tertiary">
                                {formatDateTime(notification.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<TrashIcon className="w-4 h-4" />}
                                onClick={() => removeNotification(notification.id)}
                                className="text-xs text-text-tertiary hover:text-error"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="text-center py-12">
                <BellIcon className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No notifications</h3>
                <p className="text-text-secondary">
                  You're all caught up! New notifications will appear here when they arrive.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  )
}

export default NotificationsPage