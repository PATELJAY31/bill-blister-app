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
  UserGroupIcon,
  UserIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { User, UserRole } from '@/types'

const EmployeesPage: React.FC = () => {
  const router = useRouter()
  const { addToast } = useNotificationStore()
  const [employees, setEmployees] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('')
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | ''>('')
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Mock data
  const mockEmployees: User[] = [
    {
      id: '1',
      email: 'admin@billblister.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      phone: '+1234567890',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      email: 'john.doe@company.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'EMPLOYEE',
      phone: '+1234567891',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      email: 'sarah.wilson@company.com',
      firstName: 'Sarah',
      lastName: 'Wilson',
      role: 'EMPLOYEE',
      phone: '+1234567892',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '4',
      email: 'engineer@company.com',
      firstName: 'Engineer',
      lastName: 'User',
      role: 'ENGINEER',
      phone: '+1234567893',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '5',
      email: 'approver@company.com',
      firstName: 'Approver',
      lastName: 'User',
      role: 'HO_APPROVER',
      phone: '+1234567894',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '6',
      email: 'mike.johnson@company.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      role: 'EMPLOYEE',
      phone: '+1234567895',
      isActive: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
  ]

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'EMPLOYEE', label: 'Employee' },
    { value: 'ENGINEER', label: 'Engineer' },
    { value: 'HO_APPROVER', label: 'HO Approver' },
  ]

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ]

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setEmployees(mockEmployees)
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to load employees',
        })
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [addToast])

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = !roleFilter || employee.role === roleFilter
    const matchesStatus = !statusFilter || (statusFilter === 'ACTIVE' ? employee.isActive : !employee.isActive)

    return matchesSearch && matchesRole && matchesStatus
  })

  const activeEmployees = filteredEmployees.filter(emp => emp.isActive)
  const totalEmployees = filteredEmployees.length

  const handleDeleteEmployee = (employee: User) => {
    setSelectedEmployee(employee)
    setShowDeleteModal(true)
  }

  const confirmDeleteEmployee = async () => {
    if (!selectedEmployee) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setEmployees(prevEmployees =>
        prevEmployees.filter(emp => emp.id !== selectedEmployee.id)
      )

      addToast({
        type: 'success',
        title: 'Employee Deleted',
        message: `${selectedEmployee.firstName} ${selectedEmployee.lastName} has been deleted successfully.`,
      })

      setShowDeleteModal(false)
      setSelectedEmployee(null)
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete employee. Please try again.',
      })
    }
  }

  const handleToggleStatus = async (employee: User) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.id === employee.id
            ? { ...emp, isActive: !emp.isActive }
            : emp
        )
      )

      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `${employee.firstName} ${employee.lastName} has been ${employee.isActive ? 'deactivated' : 'activated'}.`,
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update employee status. Please try again.',
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
      <Layout title="Employee Management">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Employee Management" showSearch onSearch={setSearchQuery}>
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
                  <p className="text-sm font-medium text-text-secondary">Total Employees</p>
                  <p className="text-3xl font-bold text-text-primary">{formatNumber(totalEmployees)}</p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Active Employees</p>
                  <p className="text-3xl font-bold text-success">{formatNumber(activeEmployees.length)}</p>
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
                  <p className="text-sm font-medium text-text-secondary">Inactive Employees</p>
                  <p className="text-3xl font-bold text-warning">
                    {formatNumber(totalEmployees - activeEmployees.length)}
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
                  options={roleOptions}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
                  placeholder="Filter by role"
                />
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
                      setRoleFilter('')
                      setStatusFilter('')
                      setSearchQuery('')
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    variant="primary"
                    icon={<PlusIcon className="w-4 h-4" />}
                    onClick={() => router.push('/employees/new')}
                  >
                    Add Employee
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Employees List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>
                Employees ({filteredEmployees.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-12">
                  <UserGroupIcon className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No employees found</h3>
                  <p className="text-text-secondary mb-4">
                    {searchQuery || roleFilter || statusFilter
                      ? 'Try adjusting your filters to see more results.'
                      : 'Get started by adding your first employee.'}
                  </p>
                  <Button
                    variant="primary"
                    icon={<PlusIcon className="w-4 h-4" />}
                    onClick={() => router.push('/employees/new')}
                  >
                    Add Employee
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredEmployees.map((employee, index) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-surface-tertiary/50 transition-colors p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-6 h-6 text-navy" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-medium text-text-primary">
                                {employee.firstName} {employee.lastName}
                              </h3>
                              <StatusChip 
                                status={employee.isActive ? 'ACTIVE' : 'INACTIVE'} 
                                compact 
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
                              <div className="flex items-center space-x-2">
                                <EnvelopeIcon className="w-4 h-4" />
                                <span className="truncate">{employee.email}</span>
                              </div>
                              {employee.phone && (
                                <div className="flex items-center space-x-2">
                                  <PhoneIcon className="w-4 h-4" />
                                  <span>{employee.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-text-primary">
                                  {employee.role.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>Joined {formatDate(employee.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<EyeIcon className="w-4 h-4" />}
                            onClick={() => router.push(`/employees/${employee.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<PencilIcon className="w-4 h-4" />}
                            onClick={() => router.push(`/employees/${employee.id}/edit`)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={employee.isActive ? <XCircleIcon className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}
                            onClick={() => handleToggleStatus(employee)}
                            className={employee.isActive ? 'text-warning hover:bg-warning/10' : 'text-success hover:bg-success/10'}
                          >
                            {employee.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<TrashIcon className="w-4 h-4" />}
                            onClick={() => handleDeleteEmployee(employee)}
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
        {showDeleteModal && selectedEmployee && (
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
                  <h3 className="text-lg font-semibold text-text-primary">Delete Employee</h3>
                  <p className="text-sm text-text-secondary">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-surface-tertiary rounded-lg p-4">
                  <p className="text-sm text-text-primary mb-2">
                    Are you sure you want to delete this employee?
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-navy/10 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {selectedEmployee.firstName} {selectedEmployee.lastName}
                      </p>
                      <p className="text-sm text-text-secondary">{selectedEmployee.email}</p>
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
                    onClick={confirmDeleteEmployee}
                  >
                    Delete Employee
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

export default EmployeesPage
