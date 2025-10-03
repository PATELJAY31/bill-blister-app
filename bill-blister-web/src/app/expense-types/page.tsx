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
import { formatDate, formatNumber } from '@/lib/utils'
import { useNotificationStore } from '@/store/notifications'
import {
  TagIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { ExpenseType } from '@/types'
import { expenseTypesAPI } from '@/lib/api'

const ExpenseTypesPage: React.FC = () => {
  const router = useRouter()
  const { addToast } = useNotificationStore()
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | ''>('')
  const [selectedExpenseType, setSelectedExpenseType] = useState<ExpenseType | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)


  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ]

  useEffect(() => {
    const loadExpenseTypes = async () => {
      setLoading(true)
      try {
        const response = await expenseTypesAPI.getAll()
        setExpenseTypes(response.data.data || [])
      } catch (error) {
        console.error('Failed to load expense types:', error)
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to load expense types',
        })
      } finally {
        setLoading(false)
      }
    }

    loadExpenseTypes()
  }, [addToast])

  const filteredExpenseTypes = expenseTypes.filter(expenseType => {
    const matchesSearch = 
      expenseType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expenseType.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = !statusFilter || (statusFilter === 'ACTIVE' ? expenseType.status : !expenseType.status)

    return matchesSearch && matchesStatus
  })

  const activeExpenseTypes = filteredExpenseTypes.filter(et => et.status)
  const totalExpenseTypes = filteredExpenseTypes.length

  const handleDeleteExpenseType = (expenseType: ExpenseType) => {
    setSelectedExpenseType(expenseType)
    setShowDeleteModal(true)
  }

  const confirmDeleteExpenseType = async () => {
    if (!selectedExpenseType) return

    try {
      await expenseTypesAPI.delete(selectedExpenseType.id)

      setExpenseTypes(prevTypes =>
        prevTypes.filter(et => et.id !== selectedExpenseType.id)
      )

      addToast({
        type: 'success',
        title: 'Expense Type Deleted',
        message: `${selectedExpenseType.name} has been deleted successfully.`,
      })

      setShowDeleteModal(false)
      setSelectedExpenseType(null)
    } catch (error) {
      console.error('Failed to delete expense type:', error)
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete expense type. Please try again.',
      })
    }
  }

  const handleToggleStatus = async (expenseType: ExpenseType) => {
    try {
      await expenseTypesAPI.update(expenseType.id, {
        status: !expenseType.status
      })

      setExpenseTypes(prevTypes =>
        prevTypes.map(et =>
          et.id === expenseType.id
            ? { ...et, status: !et.status }
            : et
        )
      )

      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `${expenseType.name} has been ${expenseType.status ? 'deactivated' : 'activated'}.`,
      })
    } catch (error) {
      console.error('Failed to update expense type status:', error)
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update expense type status. Please try again.',
      })
    }
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
      <Layout title="Expense Types">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Expense Types" showSearch onSearch={setSearchQuery}>
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
                  <p className="text-sm font-medium text-text-secondary">Total Types</p>
                  <p className="text-3xl font-bold text-text-primary">{formatNumber(totalExpenseTypes)}</p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                  <TagIcon className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Active Types</p>
                  <p className="text-3xl font-bold text-success">{formatNumber(activeExpenseTypes.length)}</p>
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
                  <p className="text-sm font-medium text-text-secondary">Inactive Types</p>
                  <p className="text-3xl font-bold text-warning">
                    {formatNumber(totalExpenseTypes - activeExpenseTypes.length)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <XCircleIcon className="w-6 h-6 text-warning" />
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
                  onChange={(e) => setStatusFilter(e.target.value as 'ACTIVE' | 'INACTIVE' | '')}
                  placeholder="Filter by status"
                />
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setStatusFilter('')
                      setSearchQuery('')
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    variant="primary"
                    icon={<PlusIcon className="w-4 h-4" />}
                    onClick={() => router.push('/expense-types/new')}
                  >
                    Add Expense Type
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense Types List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>
                Expense Types ({filteredExpenseTypes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredExpenseTypes.length === 0 ? (
                <div className="text-center py-12">
                  <TagIcon className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No expense types found</h3>
                  <p className="text-text-secondary mb-4">
                    {searchQuery || statusFilter
                      ? 'Try adjusting your filters to see more results.'
                      : 'Get started by adding your first expense type.'}
                  </p>
                  <Button
                    variant="primary"
                    icon={<PlusIcon className="w-4 h-4" />}
                    onClick={() => router.push('/expense-types/new')}
                  >
                    Add Expense Type
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredExpenseTypes.map((expenseType, index) => (
                    <motion.div
                      key={expenseType.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-surface-tertiary/50 transition-colors p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <TagIcon className="w-6 h-6 text-navy" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-medium text-text-primary">
                                {expenseType.name}
                              </h3>
                              <StatusChip 
                                status={expenseType.status ? 'ACTIVE' : 'INACTIVE'} 
                                compact 
                              />
                            </div>
                            
                            {expenseType.description && (
                              <p className="text-sm text-text-secondary mb-2">
                                {expenseType.description}
                              </p>
                            )}

                            <div className="flex items-center space-x-4 text-xs text-text-tertiary">
                              <span>Created: {formatDate(expenseType.createdAt)}</span>
                              <span>Updated: {formatDate(expenseType.updatedAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<EyeIcon className="w-4 h-4" />}
                            onClick={() => router.push(`/expense-types/${expenseType.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<PencilIcon className="w-4 h-4" />}
                            onClick={() => router.push(`/expense-types/${expenseType.id}/edit`)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={expenseType.status ? <XCircleIcon className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}
                            onClick={() => handleToggleStatus(expenseType)}
                            className={expenseType.status ? 'text-warning hover:bg-warning/10' : 'text-success hover:bg-success/10'}
                          >
                            {expenseType.status ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<TrashIcon className="w-4 h-4" />}
                            onClick={() => handleDeleteExpenseType(expenseType)}
                            className="text-error hover:bg-error/10"
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedExpenseType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                  <TrashIcon className="w-5 h-5 text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Delete Expense Type</h3>
                  <p className="text-sm text-text-secondary">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-surface-tertiary rounded-lg p-4">
                  <p className="text-sm text-text-primary mb-2">
                    Are you sure you want to delete this expense type?
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-navy/10 rounded-full flex items-center justify-center">
                      <TagIcon className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{selectedExpenseType.name}</p>
                      {selectedExpenseType.description && (
                        <p className="text-sm text-text-secondary">{selectedExpenseType.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="error"
                    fullWidth
                    onClick={confirmDeleteExpenseType}
                  >
                    Delete Expense Type
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  )
}

export default ExpenseTypesPage
