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
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { Claim, ClaimStatus, User, ExpenseType } from '@/types'

const ClaimsPage: React.FC = () => {
  const router = useRouter()
  const { addToast } = useNotificationStore()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | ''>('')
  const [employeeFilter, setEmployeeFilter] = useState('')

  // Mock data
  const mockClaims: Claim[] = [
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
      expenseTypeId: '1',
      expenseType: {
        id: '1',
        name: 'Food & Entertainment',
        description: 'Meals and client entertainment',
        status: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      amount: 2500,
      description: 'Client dinner meeting',
      billNumber: 'BL-001',
      billDate: '2024-01-15',
      fileUrl: null,
      notes: 'Important client discussion',
      status: 'PENDING',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
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
      expenseTypeId: '2',
      expenseType: {
        id: '2',
        name: 'Travel',
        description: 'Business travel expenses',
        status: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      amount: 8500,
      description: 'Flight to Mumbai for client meeting',
      billNumber: 'BL-002',
      billDate: '2024-01-14',
      fileUrl: null,
      notes: 'Urgent client visit',
      status: 'APPROVED',
      verifiedById: '3',
      verifiedBy: {
        id: '3',
        email: 'engineer@company.com',
        firstName: 'Engineer',
        lastName: 'User',
        role: 'ENGINEER',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      verifiedAt: '2024-01-14T15:30:00Z',
      verifiedNotes: 'Approved after verification',
      approvedById: '4',
      approvedBy: {
        id: '4',
        email: 'approver@company.com',
        firstName: 'Approver',
        lastName: 'User',
        role: 'HO_APPROVER',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      approvedAt: '2024-01-14T16:00:00Z',
      approvedNotes: 'Final approval granted',
      createdAt: '2024-01-14T14:30:00Z',
      updatedAt: '2024-01-14T16:00:00Z',
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
      expenseTypeId: '3',
      expenseType: {
        id: '3',
        name: 'Office Supplies',
        description: 'Stationery and office equipment',
        status: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      amount: 1200,
      description: 'Office stationery purchase',
      billNumber: 'BL-003',
      billDate: '2024-01-13',
      fileUrl: null,
      notes: 'Regular office supplies',
      status: 'REJECTED',
      verifiedById: '3',
      verifiedBy: {
        id: '3',
        email: 'engineer@company.com',
        firstName: 'Engineer',
        lastName: 'User',
        role: 'ENGINEER',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      verifiedAt: '2024-01-13T11:00:00Z',
      verifiedNotes: 'Rejected due to insufficient documentation',
      rejectionReason: 'Missing original receipts',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T11:00:00Z',
    },
  ]

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ]

  const employeeOptions = [
    { value: '', label: 'All Employees' },
    { value: 'John Doe', label: 'John Doe' },
    { value: 'Sarah Wilson', label: 'Sarah Wilson' },
    { value: 'Mike Johnson', label: 'Mike Johnson' },
  ]

  useEffect(() => {
    const loadClaims = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setClaims(mockClaims)
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to load claims',
        })
      } finally {
        setLoading(false)
      }
    }

    loadClaims()
  }, [addToast])

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.expenseType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.billNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = !statusFilter || claim.status === statusFilter
    const matchesEmployee = !employeeFilter || 
      `${claim.employee.firstName} ${claim.employee.lastName}` === employeeFilter

    return matchesSearch && matchesStatus && matchesEmployee
  })

  const totalAmount = filteredClaims.reduce((sum, claim) => sum + claim.amount, 0)
  const pendingAmount = filteredClaims
    .filter(claim => claim.status === 'PENDING')
    .reduce((sum, claim) => sum + claim.amount, 0)

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
      <Layout title="Expense Claims">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Expense Claims" showSearch onSearch={setSearchQuery}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Summary Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Total Claims</p>
                  <p className="text-3xl font-bold text-text-primary">{formatNumber(filteredClaims.length)}</p>
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
                  <p className="text-3xl font-bold text-warning">
                    {formatNumber(filteredClaims.filter(c => c.status === 'PENDING').length)}
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
                  <p className="text-3xl font-bold text-success">
                    {formatNumber(filteredClaims.filter(c => c.status === 'APPROVED').length)}
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
                  <p className="text-3xl font-bold text-navy">{formatCurrency(totalAmount)}</p>
                </div>
                <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-navy" />
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
                  onChange={(e) => setStatusFilter(e.target.value as ClaimStatus | '')}
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
                    onClick={() => router.push('/claims/new')}
                  >
                    New Claim
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Claims List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>
                Claims ({filteredClaims.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredClaims.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No claims found</h3>
                  <p className="text-text-secondary mb-4">
                    {searchQuery || statusFilter || employeeFilter
                      ? 'Try adjusting your filters to see more results.'
                      : 'Get started by creating your first claim.'}
                  </p>
                  <Button
                    variant="primary"
                    icon={<PlusIcon className="w-4 h-4" />}
                    onClick={() => router.push('/claims/new')}
                  >
                    Create Claim
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredClaims.map((claim, index) => (
                    <motion.div
                      key={claim.id}
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
                                {claim.employee.firstName} {claim.employee.lastName}
                              </span>
                            </div>
                            <StatusChip status={claim.status} />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-secondary mb-2">
                            <div className="flex items-center space-x-2">
                              <DocumentTextIcon className="w-4 h-4" />
                              <span>{claim.expenseType.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{formatDate(claim.billDate)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CurrencyDollarIcon className="w-4 h-4" />
                              <span className="font-medium text-text-primary">
                                {formatCurrency(claim.amount)}
                              </span>
                            </div>
                          </div>

                          {claim.description && (
                            <p className="text-sm text-text-secondary mb-2">
                              {claim.description}
                            </p>
                          )}

                          {claim.billNumber && (
                            <p className="text-xs text-text-tertiary">
                              Bill #: {claim.billNumber}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<EyeIcon className="w-4 h-4" />}
                            onClick={() => router.push(`/claims/${claim.id}`)}
                          >
                            View
                          </Button>
                          {claim.status === 'PENDING' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<PencilIcon className="w-4 h-4" />}
                              onClick={() => router.push(`/claims/${claim.id}/edit`)}
                            >
                              Edit
                            </Button>
                          )}
                          {claim.status === 'PENDING' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<TrashIcon className="w-4 h-4" />}
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this claim?')) {
                                  addToast({
                                    type: 'success',
                                    title: 'Claim Deleted',
                                    message: 'The claim has been successfully deleted.',
                                  })
                                }
                              }}
                            >
                              Delete
                            </Button>
                          )}
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

export default ClaimsPage
