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
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  UserCheckIcon,
} from '@heroicons/react/24/outline'
import { Claim, ClaimStatus, User, ExpenseType } from '@/types'
import { claimsAPI } from '@/lib/api'

const ApprovalPage: React.FC = () => {
  const router = useRouter()
  const { addToast } = useNotificationStore()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | ''>('')
  const [employeeFilter, setEmployeeFilter] = useState('')
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalNotes, setApprovalNotes] = useState('')
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null)

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'APPROVED', label: 'Verified (Ready for HO Approval)' },
    { value: 'PENDING', label: 'Pending Verification' },
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
        // Load claims that are verified and ready for HO approval
        const response = await claimsAPI.getAll({ status: 'APPROVED' })
        setClaims(response.data.data || [])
      } catch (error) {
        console.error('Failed to load claims:', error)
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to load claims for approval',
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

  const verifiedClaims = filteredClaims.filter(claim => claim.status === 'APPROVED' && claim.verifiedById)
  const totalAmount = filteredClaims.reduce((sum, claim) => sum + claim.amount, 0)
  const verifiedAmount = verifiedClaims.reduce((sum, claim) => sum + claim.amount, 0)

  const handleApproveClaim = (claim: Claim, action: 'approve' | 'reject') => {
    setSelectedClaim(claim)
    setApprovalAction(action)
    setApprovalNotes('')
    setShowApprovalModal(true)
  }

  const handleSubmitApproval = async () => {
    if (!selectedClaim || !approvalAction) return

    try {
      // Call the API to approve/reject the claim
      await claimsAPI.verify(selectedClaim.id, {
        status: approvalAction === 'approve' ? 'APPROVED' : 'REJECTED',
        notes: approvalNotes,
      })

      // Update local state
      setClaims(prevClaims =>
        prevClaims.map(claim =>
          claim.id === selectedClaim.id
            ? {
                ...claim,
                status: approvalAction === 'approve' ? 'APPROVED' : 'REJECTED',
                approvedById: 'current-ho-user-id',
                approvedAt: new Date().toISOString(),
                approvedNotes: approvalNotes,
                rejectionReason: approvalAction === 'reject' ? approvalNotes : undefined,
              }
            : claim
        )
      )

      addToast({
        type: 'success',
        title: 'Claim Processed',
        message: `Claim has been ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully.`,
      })

      setShowApprovalModal(false)
      setSelectedClaim(null)
      setApprovalAction(null)
      setApprovalNotes('')
    } catch (error) {
      console.error('Failed to process claim:', error)
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to process claim. Please try again.',
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
      <Layout title="Claim Approval">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Claim Approval" showSearch onSearch={setSearchQuery}>
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
                  <p className="text-sm font-medium text-text-secondary">Ready for Approval</p>
                  <p className="text-3xl font-bold text-warning">{formatNumber(verifiedClaims.length)}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <UserCheckIcon className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Verified Amount</p>
                  <p className="text-3xl font-bold text-navy">{formatCurrency(verifiedAmount)}</p>
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
                  <p className="text-sm font-medium text-text-secondary">Total Amount</p>
                  <p className="text-3xl font-bold text-text-primary">{formatCurrency(totalAmount)}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-success" />
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
                Claims for HO Approval ({filteredClaims.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredClaims.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No claims found</h3>
                  <p className="text-text-secondary">
                    {searchQuery || statusFilter || employeeFilter
                      ? 'Try adjusting your filters to see more results.'
                      : 'There are no claims ready for HO approval.'}
                  </p>
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

                          {claim.verifiedBy && (
                            <div className="bg-surface-tertiary rounded-lg p-3 mb-2">
                              <p className="text-xs text-text-tertiary mb-1">Verified by Engineer</p>
                              <p className="text-sm text-text-primary">
                                {claim.verifiedBy.firstName} {claim.verifiedBy.lastName}
                              </p>
                              {claim.verifiedNotes && (
                                <p className="text-xs text-text-secondary mt-1">
                                  "{claim.verifiedNotes}"
                                </p>
                              )}
                            </div>
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
                            View Details
                          </Button>
                          {claim.status === 'APPROVED' && claim.verifiedById && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<CheckCircleIcon className="w-4 h-4" />}
                                onClick={() => handleApproveClaim(claim, 'approve')}
                                className="text-success hover:bg-success/10"
                              >
                                Final Approve
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<XCircleIcon className="w-4 h-4" />}
                                onClick={() => handleApproveClaim(claim, 'reject')}
                                className="text-error hover:bg-error/10"
                              >
                                Reject
                              </Button>
                            </>
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

        {/* Approval Modal */}
        {showApprovalModal && selectedClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowApprovalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  approvalAction === 'approve' ? 'bg-success/10' : 'bg-error/10'
                }`}>
                  {approvalAction === 'approve' ? (
                    <CheckCircleIcon className="w-5 h-5 text-success" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-error" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {approvalAction === 'approve' ? 'Final Approve' : 'Reject'} Claim
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {selectedClaim.employee.firstName} {selectedClaim.employee.lastName}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-surface-tertiary rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-primary">Amount</span>
                    <span className="text-lg font-bold text-navy">
                      {formatCurrency(selectedClaim.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-primary">Expense Type</span>
                    <span className="text-sm text-text-secondary">
                      {selectedClaim.expenseType.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-text-primary">Bill Date</span>
                    <span className="text-sm text-text-secondary">
                      {formatDate(selectedClaim.billDate)}
                    </span>
                  </div>
                </div>

                <Input
                  label={`${approvalAction === 'approve' ? 'Final Approval' : 'Rejection'} Notes`}
                  placeholder={`Enter your ${approvalAction === 'approve' ? 'final approval' : 'rejection'} notes...`}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  multiline
                  rows={3}
                />

                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setShowApprovalModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={approvalAction === 'approve' ? 'success' : 'error'}
                    fullWidth
                    onClick={handleSubmitApproval}
                    disabled={!approvalNotes.trim()}
                  >
                    {approvalAction === 'approve' ? 'Final Approve' : 'Reject'} Claim
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

export default ApprovalPage
