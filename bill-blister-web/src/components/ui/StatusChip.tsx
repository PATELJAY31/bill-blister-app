'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ClaimStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusChipProps {
  status: ClaimStatus;
  compact?: boolean;
  className?: string;
  animated?: boolean;
}

const StatusChip: React.FC<StatusChipProps> = ({ 
  status, 
  compact = false, 
  className = '', 
  animated = true 
}) => {
  const getStatusConfig = (status: ClaimStatus) => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircleIcon,
          text: 'Approved',
          className: 'bg-success/10 text-success border-success/20',
        };
      case 'pending':
        return {
          icon: ClockIcon,
          text: 'Pending',
          className: 'bg-warning/10 text-warning border-warning/20',
        };
      case 'rejected':
        return {
          icon: XCircleIcon,
          text: 'Rejected',
          className: 'bg-error/10 text-error border-error/20',
        };
      default:
        return {
          icon: ClockIcon,
          text: 'Unknown',
          className: 'bg-info/10 text-info border-info/20',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

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
  };

  const content = (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
      config.className,
      className
    )}>
      <Icon className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
      {!compact && <span>{config.text}</span>}
    </span>
  );

  if (!animated) {
    return content;
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
  );
};

export default StatusChip;