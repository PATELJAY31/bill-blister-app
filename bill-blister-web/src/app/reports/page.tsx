'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import { useNotificationStore } from '@/store/notifications'
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  UserIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

const ReportsPage: React.FC = () => {
  const { addToast } = useNotificationStore()
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  })
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [selectedExpenseType, setSelectedExpenseType] = useState('')
  const [reportType, setReportType] = useState('overview')

  // Mock data for reports
  const expenseTrendData = [
    { month: 'Jan', amount: 45000, claims: 25, allocations: 12 },
    { month: 'Feb', amount: 52000, claims: 32, allocations: 15 },
    { month: 'Mar', amount: 48000, claims: 28, allocations: 13 },
    { month: 'Apr', amount: 61000, claims: 35, allocations: 18 },
    { month: 'May', amount: 55000, claims: 30, allocations: 16 },
    { month: 'Jun', amount: 67000, claims: 38, allocations: 20 },
  ]

  const claimsByStatusData = [
    { name: 'Approved', value: 118, amount: 245000, color: '#10B981' },
    { name: 'Pending', value: 23, amount: 45000, color: '#F59E0B' },
    { name: 'Rejected', value: 15, amount: 25000, color: '#EF4444' },
  ]

  const topEmployeesData = [
    { name: 'John Doe', claims: 15, amount: 25000, percentage: 25 },
    { name: 'Sarah Wilson', claims: 12, amount: 18000, percentage: 20 },
    { name: 'Mike Johnson', claims: 10, amount: 15000, percentage: 15 },
    { name: 'Emily Davis', claims: 8, amount: 12000, percentage: 12 },
    { name: 'David Brown', claims: 6, amount: 9000, percentage: 8 },
  ]

  const expenseTypeData = [
    { name: 'Food & Entertainment', amount: 45000, percentage: 35 },
    { name: 'Travel', amount: 35000, percentage: 27 },
    { name: 'Office Supplies', amount: 20000, percentage: 15 },
    { name: 'Utilities', amount: 15000, percentage: 12 },
    { name: 'Other', amount: 10000, percentage: 11 },
  ]

  const monthlyComparisonData = [
    { month: 'Jan', current: 45000, previous: 42000 },
    { month: 'Feb', current: 52000, previous: 48000 },
    { month: 'Mar', current: 48000, previous: 51000 },
    { month: 'Apr', current: 61000, previous: 55000 },
    { month: 'May', current: 55000, previous: 58000 },
    { month: 'Jun', current: 67000, previous: 62000 },
  ]

  const employeeOptions = [
    { value: '', label: 'All Employees' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
  ]

  const expenseTypeOptions = [
    { value: '', label: 'All Expense Types' },
    { value: 'food', label: 'Food & Entertainment' },
    { value: 'travel', label: 'Travel' },
    { value: 'supplies', label: 'Office Supplies' },
  ]

  const reportTypeOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'claims', label: 'Claims Report' },
    { value: 'allocations', label: 'Allocations Report' },
    { value: 'employees', label: 'Employee Report' },
  ]

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // In a real app, this would be an API call
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to load reports data',
        })
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [addToast])

  const handleExportReport = (format: 'pdf' | 'excel') => {
    addToast({
      type: 'success',
      title: 'Export Started',
      message: `Report is being exported as ${format.toUpperCase()}. Download will start shortly.`,
    })
  }

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
      <Layout title="Reports & Analytics">
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-xl" />
          ))}
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Reports & Analytics">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FunnelIcon className="w-5 h-5" />
                Report Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Date Range</label>
                  <div className="flex space-x-2">
                    <Input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    />
                    <Input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <Select
                  options={employeeOptions}
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  placeholder="Select Employee"
                />
                <Select
                  options={expenseTypeOptions}
                  value={selectedExpenseType}
                  onChange={(e) => setSelectedExpenseType(e.target.value)}
                  placeholder="Select Expense Type"
                />
                <Select
                  options={reportTypeOptions}
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  placeholder="Select Report Type"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="secondary"
                  icon={<DocumentArrowDownIcon className="w-4 h-4" />}
                  onClick={() => handleExportReport('pdf')}
                >
                  Export PDF
                </Button>
                <Button
                  variant="secondary"
                  icon={<DocumentArrowDownIcon className="w-4 h-4" />}
                  onClick={() => handleExportReport('excel')}
                >
                  Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Total Claims</p>
                  <p className="text-3xl font-bold text-text-primary">156</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                    +12% from last month
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
                  <p className="text-sm font-medium text-text-secondary">Total Amount</p>
                  <p className="text-3xl font-bold text-navy">{formatCurrency(315000)}</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                    +8% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-navy" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Active Employees</p>
                  <p className="text-3xl font-bold text-success">24</p>
                  <p className="text-xs text-text-tertiary mt-1">
                    Across all departments
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Approval Rate</p>
                  <p className="text-3xl font-bold text-warning">76%</p>
                  <p className="text-xs text-warning flex items-center mt-1">
                    <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                    -2% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Trends */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Expense Trends (6 Months)</CardTitle>
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

          {/* Claims by Status */}
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
                      <div className="text-right">
                        <span className="text-sm font-medium text-text-primary">{item.value}</span>
                        <span className="text-xs text-text-tertiary ml-2">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Employees */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Top Employees by Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topEmployeesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
                      <Bar dataKey="amount" fill="#1A1B3A" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expense Types */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseTypeData.map((item, index) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text-primary">{item.name}</span>
                        <span className="text-sm text-text-secondary">
                          {formatCurrency(item.amount)} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-surface-tertiary rounded-full h-2">
                        <div
                          className="bg-navy h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Comparison */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
                    <Bar dataKey="current" fill="#1A1B3A" name="Current Year" />
                    <Bar dataKey="previous" fill="#6B7280" name="Previous Year" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  )
}

export default ReportsPage
