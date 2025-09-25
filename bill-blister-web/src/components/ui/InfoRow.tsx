'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InfoRowProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  animated?: boolean;
  delay?: number;
}

const InfoRow: React.FC<InfoRowProps> = ({ 
  label, 
  value, 
  icon, 
  onClick, 
  className = '',
  animated = true,
  delay = 0
}) => {
  const rowVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delay: delay * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: onClick ? {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    } : {}
  };

  const content = (
    <div 
      className={cn(
        "flex items-center justify-between py-4 px-6 border-b border-gray-100 last:border-b-0 transition-all duration-200",
        onClick && "cursor-pointer hover:bg-gray-50/50 hover:shadow-sm",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex-shrink-0 text-gray-400">
            {icon}
          </div>
        )}
        <span className="text-sm font-medium text-text-primary">
          {label}
        </span>
      </div>
      <span className="text-sm text-text-secondary font-medium">
        {value}
      </span>
    </div>
  );

  if (!animated) {
    return content;
  }

  return (
    <motion.div
      variants={rowVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {content}
    </motion.div>
  );
};

export default InfoRow;