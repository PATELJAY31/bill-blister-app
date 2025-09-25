'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = '',
}) => {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  return (
    <motion.div 
      className={cn(
        "text-center py-12 px-6",
        className
      )}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div 
        className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"
        variants={iconVariants}
      >
        {icon || <DocumentTextIcon className="w-10 h-10" />}
      </motion.div>
      
      <motion.h3 
        className="text-xl font-semibold text-text-primary mb-2"
        variants={itemVariants}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="text-sm text-text-secondary mb-8 max-w-md mx-auto"
        variants={itemVariants}
      >
        {description}
      </motion.p>
      
      {(actionText || secondaryActionText) && (
        <motion.div 
          className="flex flex-col sm:flex-row gap-3 justify-center"
          variants={itemVariants}
        >
          {actionText && onAction && (
            <Button
              onClick={onAction}
              className="gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              {actionText}
            </Button>
          )}
          
          {secondaryActionText && onSecondaryAction && (
            <Button
              onClick={onSecondaryAction}
              variant="outline"
            >
              {secondaryActionText}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;