import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notifications'
import Button from '@/components/ui/Button'
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  CogIcon,
} from '@heroicons/react/24/outline'

interface HeaderProps {
  onMenuClick: () => void
  title?: string
  showSearch?: boolean
  onSearch?: (query: string) => void
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  title = "Dashboard",
  showSearch = false,
  onSearch,
}) => {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    router.push('/notifications')
  }

  return (
    <header className="bg-surface border-b border-border shadow-soft">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon={<Bars3Icon className="w-5 h-5" />}
            onClick={onMenuClick}
            className="lg:hidden"
          />
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
          </div>
        </div>

        {/* Center Section - Search */}
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 max-w-md mx-4"
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                />
              </div>
            </form>
          </motion.div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            icon={<BellIcon className="w-5 h-5" />}
            onClick={handleNotificationClick}
            className="relative"
          >
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              icon={<UserCircleIcon className="w-5 h-5" />}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2"
            >
              <span className="hidden sm:block text-sm font-medium text-text-primary">
                {user?.firstName} {user?.lastName}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-text-tertiary" />
            </Button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-strong z-50"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-divider">
                      <p className="text-sm font-medium text-text-primary">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {user?.email}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {user?.role?.replace('_', ' ')}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          router.push('/profile')
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-text-primary hover:bg-surface-tertiary rounded-lg transition-colors"
                      >
                        <UserCircleIcon className="w-4 h-4 mr-3" />
                        Profile
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          router.push('/settings')
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-text-primary hover:bg-surface-tertiary rounded-lg transition-colors"
                      >
                        <CogIcon className="w-4 h-4 mr-3" />
                        Settings
                      </button>
                      
                      <div className="border-t border-divider my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header