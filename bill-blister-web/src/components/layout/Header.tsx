'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bars3Icon, BellIcon, PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
  onNotificationClick: () => void;
  onAddClick: () => void;
  onFilterClick: () => void;
  title: string;
  showActions?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onNotificationClick,
  onAddClick,
  onFilterClick,
  title,
  showActions = true,
}) => {
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
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

  return (
    <motion.header 
      className="bg-surface border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-sm bg-surface/95"
      variants={headerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            onClick={onMenuClick}
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <Bars3Icon className="w-5 h-5" />
          </Button>
        </motion.div>
        
        <motion.h1 
          className="text-xl font-semibold text-text-primary"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {title}
        </motion.h1>
      </div>

      {/* Right side */}
      {showActions && (
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={onFilterClick}
              variant="ghost"
              size="icon"
              title="Filter"
            >
              <FunnelIcon className="w-5 h-5" />
            </Button>
          </motion.div>
          
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={onAddClick}
              variant="ghost"
              size="icon"
              title="Add New"
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </motion.div>
          
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative"
          >
            <Button
              onClick={onNotificationClick}
              variant="ghost"
              size="icon"
              title="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              {/* Notification badge */}
              <motion.span 
                className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;