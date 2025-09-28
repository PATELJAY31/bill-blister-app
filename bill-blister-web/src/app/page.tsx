'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard as the default route
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="animate-spin rounded-full h-12 w-12 border-4 border-navy border-t-transparent mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p 
          className="text-text-secondary text-lg font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Redirecting to Bill Blister App...
        </motion.p>
      </motion.div>
    </div>
  )
}