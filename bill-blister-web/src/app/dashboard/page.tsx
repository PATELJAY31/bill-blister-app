'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StatusChip from '@/components/ui/StatusChip'
import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notifications'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  BellIcon,
  PlusIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

interface DashboardStats {
  totalClaims: number
  pendingClaims: number
  approvedClaims: number
  rejectedClaims: number
  totalAllocations: number
  totalAmount: number
  monthlyGrowth: number
  recentActivity: ActivityItem[]
}

interface ActivityItem {
  id: string
  type: 'CLAIM_CREATED' | 'CLAIM_VERIFIED' | 'CLAIM_APPROVED' | 'CLAIM_REJECTED' | 'ALLOCATION_CREATED'
  title: string
  description: string
  user: string
  timestamp: string
  amount?: number
}

const DashboardPage: React.FC = () => {
  const router = useRouter()
  const { user } = useAuthStore()
  const { addToast } = useNotificationStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalClaims: 156,
    pendingClaims: 23,
    approvedClaims: 118,
    rejectedClaims: 15,
    totalAllocations: 89,
    totalAmount: 245670.50,
    monthlyGrowth: 12.5,
    recentActivity: [
      {
        id: '1',
        type: 'CLAIM_CREATED',
        title: 'New Expense Claim',
        description: 'John Doe submitted a claim for ₹2,500',
        user: 'John Doe',
        timestamp: '2024-01-15T10:30:00Z',
        amount: 2500,
      },
      {
        id: '2',
        type: 'CLAIM_APPROVED',
        title: 'Claim Approved',
        description: 'Sarah Wilson approved a claim for ₹1,200',
        user: 'Sarah Wilson',
        timestamp: '2024-01-15T09:15:00Z',
        amount: 1200,
      },
      {
        id: '3',
        type: 'ALLOCATION_CREATED',
        title: 'New Allocation',
        description: 'Budget allocated to Marketing team',
        user: 'Admin User',
        timestamp: '2024-01-15T08:45:00Z',
        amount: 50000,
      },
      {
        id: '4',
        type: 'CLAIM_REJECTED',
        title: 'Claim Rejected',
        description: 'Mike Johnson rejected a claim for ₹800',
        user: 'Mike Johnson',
        timestamp: '2024-01-14T16:20:00Z',
        amount: 800,
      },
    ],
  }

  // Mock chart data
  const expenseTrendData = [
    { month: 'Jan', amount: 45000, claims: 25 },
    { month: 'Feb', amount: 52000, claims: 32 },
    { month: 'Mar', amount: 48000, claims: 28 },
    { month: 'Apr', amount: 61000, claims: 35 },
    { month: 'May', amount: 55000, claims: 30 },
    { month: 'Jun', amount: 67000, claims: 38 },
  ]

  const claimsByStatusData = [
    { name: 'Approved', value: 118, color: '#10B981' },
    { name: 'Pending', value: 23, color: '#F59E0B' },
    { name: 'Rejected', value: 15, color: '#EF4444' },
  ]

  const topEmployeesData = [
    { name: 'John Doe', claims: 15, amount: 25000 },
    { name: 'Sarah Wilson', claims: 12, amount: 18000 },
    { name: 'Mike Johnson', claims: 10, amount: 15000 },
    { name: 'Emily Davis', claims: 8, amount: 12000 },
    { name: 'David Brown', claims: 6, amount: 9000 },
  ]

  useEffect(() => {
    // Simulate API call
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStats(mockStats)
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to load dashboard data',
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [addToast])

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
      <Layout title="Dashboard">
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </Layout>
    )
  }

  if (!stats) {
    return (
      <Layout title="Dashboard">
        <div className="text-center py-12">
          <p className="text-text-secondary">Failed to load dashboard data</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Dashboard">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-text-secondary mt-1">
                Here's what's happening with your expense management today.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                icon={<PlusIcon className="w-4 h-4" />}
                onClick={() => router.push('/claims/new')}
              >
                New Claim
              </Button>
              <Button
                variant="primary"
                icon={<PlusIcon className="w-4 h-4" />}
                onClick={() => router.push('/allocations/new')}
              >
                New Allocation
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Total Claims</p>
                  <p className="text-3xl font-bold text-text-primary">{formatNumber(stats.totalClaims)}</p>
                  <p className="text-xs text-text-tertiary mt-1">
                    <ArrowTrendingUpIcon className="w-3 h-3 inline mr-1" />
                    +{stats.monthlyGrowth}% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Pending Claims</p>
                  <p className="text-3xl font-bold text-warning">{formatNumber(stats.pendingClaims)}</p>
                  <p className="text-xs text-text-tertiary mt-1">
                    Awaiting verification
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Approved Claims</p>
                  <p className="text-3xl font-bold text-success">{formatNumber(stats.approvedClaims)}</p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {Math.round((stats.approvedClaims / stats.totalClaims) * 100)}% approval rate
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Total Amount</p>
                  <p className="text-3xl font-bold text-text-primary">{formatCurrency(stats.totalAmount)}</p>
                  <p className="text-xs text-text-tertiary mt-1">
                    Across {stats.totalAllocations} allocations
                  </p>
                </div>
                <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-navy" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Trend Chart */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Expense Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={expenseTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#1A1B3A"
                        strokeWidth={2}
                        dot={{ fill: '#1A1B3A', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Claims Status Distribution */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Claims by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={claimsByStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {claimsByStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Claims']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {claimsByStatusData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-text-secondary">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-text-primary">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity and Top Employees */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/notifications')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-surface-tertiary transition-colors"
                    >
                      <div className="w-8 h-8 bg-surface-tertiary rounded-full flex items-center justify-center flex-shrink-0">
                        {activity.type === 'CLAIM_CREATED' && <DocumentTextIcon className="w-4 h-4 text-info" />}
                        {activity.type === 'CLAIM_APPROVED' && <CheckCircleIcon className="w-4 h-4 text-success" />}
                        {activity.type === 'CLAIM_REJECTED' && <XCircleIcon className="w-4 h-4 text-error" />}
                        {activity.type === 'ALLOCATION_CREATED' && <CurrencyDollarIcon className="w-4 h-4 text-navy" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">{activity.title}</p>
                        <p className="text-sm text-text-secondary">{activity.description}</p>
                        <p className="text-xs text-text-tertiary mt-1">
                          {formatDate(activity.timestamp)} • {activity.user}
                        </p>
                      </div>
                      {activity.amount && (
                        <div className="text-sm font-medium text-text-primary">
                          {formatCurrency(activity.amount)}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Employees */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Top Employees by Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topEmployeesData.map((employee, index) => (
                    <motion.div
                      key={employee.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-tertiary transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-navy/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-navy">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{employee.name}</p>
                          <p className="text-xs text-text-secondary">{employee.claims} claims</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-text-primary">
                          {formatCurrency(employee.amount)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  )
}

export default DashboardPage
