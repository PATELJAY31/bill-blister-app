import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon, ClockIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { ClaimStatus, AllocationStatus } from '@/types'

interface StatusChipProps {
  status: ClaimStatus | AllocationStatus | string
  compact?: boolean
  className?: string
  animated?: boolean
  showIcon?: boolean
}

const StatusChip: React.FC<StatusChipProps> = ({
  status,
  compact = false,
  className = '',
  animated = true,
  showIcon = true,
}) => {
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    
    switch (normalizedStatus) {
      case 'approved':
        return {
          icon: CheckCircleIcon,
          text: 'Approved',
          className: 'status-approved',
        }
      case 'pending':
        return {
          icon: ClockIcon,
          text: 'Pending',
          className: 'status-pending',
        }
      case 'rejected':
        return {
          icon: XCircleIcon,
          text: 'Rejected',
          className: 'status-rejected',
        }
      case 'active':
        return {
          icon: CheckCircleIcon,
          text: 'Active',
          className: 'status-approved',
        }
      case 'inactive':
        return {
          icon: ExclamationTriangleIcon,
          text: 'Inactive',
          className: 'bg-muted/10 text-muted border border-muted/20',
        }
      case 'expired':
        return {
          icon: XCircleIcon,
          text: 'Expired',
          className: 'status-rejected',
        }
      default:
        return {
          icon: ClockIcon,
          text: capitalize(status),
          className: 'bg-info/10 text-info border border-info/20',
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  const chipVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  }

  const content = (
    <span className={cn(
      "status-chip inline-flex items-center gap-1.5",
      config.className,
      {
        'px-2 py-1 text-xs': compact,
        'px-3 py-1.5 text-sm': !compact,
      },
      className
    )}>
      {showIcon && <Icon className={compact ? 'w-3 h-3' : 'w-4 h-4'} />}
      {!compact && <span>{config.text}</span>}
    </span>
  )

  if (!animated) {
    return content
  }

  return (
    <motion.div
      variants={chipVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
    >
      {content}
    </motion.div>
  )
}

// Helper function to capitalize strings
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default StatusChip