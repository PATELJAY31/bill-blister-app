import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import Sidebar from './Sidebar'
import Header from './Header'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  showSearch?: boolean
  onSearch?: (query: string) => void
  className?: string
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "Dashboard",
  showSearch = false,
  onSearch,
  className,
}) => {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Close sidebar on route change
    const handleRouteChange = () => setSidebarOpen(false)
    router.events?.on('routeChangeStart', handleRouteChange)
    
    return () => {
      router.events?.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </motion.div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className={cn(
        "flex flex-col transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title={title}
          showSearch={showSearch}
          onSearch={onSearch}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn("max-w-7xl mx-auto", className)}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Layout