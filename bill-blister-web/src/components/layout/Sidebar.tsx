import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NavItem, UserRole } from '@/types'
import { useAuthStore } from '@/store/auth'
import {
  HomeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon,
  CogIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      roles: ['ADMIN', 'EMPLOYEE', 'ENGINEER', 'HO_APPROVER'],
    },
    {
      id: 'allocations',
      label: 'Amount Allocation',
      href: '/allocations',
      icon: CurrencyDollarIcon,
      roles: ['ADMIN', 'EMPLOYEE', 'ENGINEER', 'HO_APPROVER'],
    },
    {
      id: 'claims',
      label: 'Expense Claims',
      href: '/claims',
      icon: DocumentTextIcon,
      roles: ['ADMIN', 'EMPLOYEE', 'ENGINEER', 'HO_APPROVER'],
    },
    {
      id: 'verification',
      label: 'Claim Verification',
      href: '/verification',
      icon: CheckCircleIcon,
      roles: ['ADMIN', 'ENGINEER'],
    },
    {
      id: 'approval',
      label: 'Claim Approval',
      href: '/approval',
      icon: ClipboardDocumentListIcon,
      roles: ['ADMIN', 'HO_APPROVER'],
    },
    {
      id: 'employees',
      label: 'Employee Management',
      href: '/employees',
      icon: UserGroupIcon,
      roles: ['ADMIN'],
    },
    {
      id: 'expense-types',
      label: 'Expense Types',
      href: '/expense-types',
      icon: BuildingOfficeIcon,
      roles: ['ADMIN'],
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      href: '/reports',
      icon: ChartBarIcon,
      roles: ['ADMIN', 'ENGINEER', 'HO_APPROVER'],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      href: '/notifications',
      icon: BellIcon,
      roles: ['ADMIN', 'EMPLOYEE', 'ENGINEER', 'HO_APPROVER'],
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: CogIcon,
      roles: ['ADMIN'],
    },
  ]

  const filteredNavItems = navigationItems.filter(item =>
    user?.role ? item.roles.includes(user.role) : false
  )

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed left-0 top-0 h-full w-64 bg-navy text-onNavy z-50 lg:translate-x-0 lg:static lg:z-auto"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-navy-light">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-onNavy/20 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-onNavy" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-onNavy">Bill Blister</h1>
                <p className="text-xs text-onNavy-secondary">Expense Management</p>
              </div>
            </motion.div>
          </div>

          {/* User Info */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 border-b border-navy-light"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-onNavy/20 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-onNavy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-onNavy truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-onNavy-secondary truncate">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-1">
              {filteredNavItems.map((item, index) => {
                const isActive = pathname === item.href
                
                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        {
                          "bg-onNavy/20 text-onNavy": isActive,
                          "text-onNavy-secondary hover:text-onNavy hover:bg-onNavy/10": !isActive,
                        }
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto bg-error text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 border-t border-navy-light"
          >
            <div className="text-xs text-onNavy-secondary text-center">
              <p>Bill Blister v1.0.0</p>
              <p>© 2024 All rights reserved</p>
            </div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar