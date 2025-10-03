'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import StatusChip from '@/components/ui/StatusChip'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import { useNotificationStore } from '@/store/notifications'
import {
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  FunnelIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { Allocation, AllocationStatus, User } from '@/types'
import { allocationsAPI } from '@/lib/api'

const AllocationsPage: React.FC = () => {
  const router = useRouter()
  const { addToast } = useNotificationStore()
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<AllocationStatus | ''>('')
  const [employeeFilter, setEmployeeFilter] = useState('')


  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'EXPIRED', label: 'Expired' },
  ]

  const employeeOptions = [
    { value: '', label: 'All Employees' },
    { value: 'John Doe', label: 'John Doe' },
    { value: 'Sarah Wilson', label: 'Sarah Wilson' },
    { value: 'Mike Johnson', label: 'Mike Johnson' },
  ]

  useEffect(() => {
    const loadAllocations = async () => {
      setLoading(true)
      try {
        const response = await allocationsAPI.getAll()
        setAllocations(response.data.data || [])
      } catch (error) {
        console.error('Failed to load allocations:', error)
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to load allocations',
        })
      } finally {
        setLoading(false)
      }
    }

    loadAllocations()
  }, [addToast])

  const filteredAllocations = allocations.filter(allocation => {
    const matchesSearch = 
      allocation.employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allocation.employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allocation.expenseType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allocation.billNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = !statusFilter || allocation.status === statusFilter
    const matchesEmployee = !employeeFilter || 
      `${allocation.employee.firstName} ${allocation.employee.lastName}` === employeeFilter

    return matchesSearch && matchesStatus && matchesEmployee
  })

  const totalAmount = filteredAllocations.reduce((sum, allocation) => sum + allocation.amount, 0)

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
      <Layout title="Amount Allocation">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Amount Allocation" showSearch onSearch={setSearchQuery}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Summary Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Total Allocations</p>
                  <p className="text-3xl font-bold text-text-primary">{formatNumber(filteredAllocations.length)}</p>
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
                  <p className="text-3xl font-bold text-navy">{formatCurrency(totalAmount)}</p>
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
                  <p className="text-sm font-medium text-text-secondary">Active Allocations</p>
                  <p className="text-3xl font-bold text-success">
                    {formatNumber(filteredAllocations.filter(a => a.status === 'ACTIVE').length)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FunnelIcon className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as AllocationStatus | '')}
                  placeholder="Filter by status"
                />
                <Select
                  options={employeeOptions}
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  placeholder="Filter by employee"
                />
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setStatusFilter('')
                      setEmployeeFilter('')
                      setSearchQuery('')
                    }}
                  >
                    Clear Filters
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Allocations List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>
                Allocations ({filteredAllocations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredAllocations.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No allocations found</h3>
                  <p className="text-text-secondary mb-4">
                    {searchQuery || statusFilter || employeeFilter
                      ? 'Try adjusting your filters to see more results.'
                      : 'Get started by creating your first allocation.'}
                  </p>
                  <Button
                    variant="primary"
                    icon={<PlusIcon className="w-4 h-4" />}
                    onClick={() => router.push('/allocations/new')}
                  >
                    Create Allocation
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredAllocations.map((allocation, index) => (
                    <motion.div
                      key={allocation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-surface-tertiary/50 transition-colors p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex items-center space-x-2">
                              <UserIcon className="w-4 h-4 text-text-tertiary" />
                              <span className="font-medium text-text-primary">
                                {allocation.employee.firstName} {allocation.employee.lastName}
                              </span>
                            </div>
                            <StatusChip status={allocation.status} />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-secondary">
                            <div className="flex items-center space-x-2">
                              <DocumentTextIcon className="w-4 h-4" />
                              <span>{allocation.expenseType.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{formatDate(allocation.allocationDate)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CurrencyDollarIcon className="w-4 h-4" />
                              <span className="font-medium text-text-primary">
                                {formatCurrency(allocation.amount)}
                              </span>
                            </div>
                          </div>

                          {allocation.remarks && (
                            <p className="text-sm text-text-secondary mt-2">
                              {allocation.remarks}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<EyeIcon className="w-4 h-4" />}
                            onClick={() => router.push(`/allocations/${allocation.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<PencilIcon className="w-4 h-4" />}
                            onClick={() => router.push(`/allocations/${allocation.id}/edit`)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<TrashIcon className="w-4 h-4" />}
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this allocation?')) {
                                addToast({
                                  type: 'success',
                                  title: 'Allocation Deleted',
                                  message: 'The allocation has been successfully deleted.',
                                })
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  )
}

export default AllocationsPage
