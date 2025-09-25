'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  BellIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  BellIcon as BellIconSolid,
} from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    name: 'Amount Allocation',
    href: '/amount-allocation',
    icon: CurrencyDollarIcon,
    iconSolid: CurrencyDollarIconSolid,
  },
  {
    name: 'Expense Claims',
    href: '/expense-claim',
    icon: DocumentTextIcon,
    iconSolid: DocumentTextIconSolid,
  },
  {
    name: 'Claim Verification',
    href: '/claim-verification',
    icon: CheckCircleIcon,
    iconSolid: CheckCircleIconSolid,
  },
  {
    name: 'Claim Approval',
    href: '/claim-approval',
    icon: CheckCircleIcon,
    iconSolid: CheckCircleIconSolid,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: BellIcon,
    iconSolid: BellIconSolid,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const sidebarVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { 
      opacity: 1, 
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const childVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 left-0 w-64 h-full bg-surface border-r border-gray-200 z-50 lg:translate-x-0"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div 
                className="p-6 border-b border-gray-200"
                variants={childVariants}
              >
                <div className="flex items-center justify-between">
                  <motion.h1 
                    className="text-xl font-bold text-text-primary"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Bill Blister
                  </motion.h1>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>

              {/* Navigation */}
              <motion.nav 
                className="flex-1 p-4"
                variants={itemVariants}
              >
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href;
                  const Icon = isActive ? item.iconSolid : item.icon;
                  
                  return (
                    <motion.div
                      key={item.name}
                      variants={childVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 mb-1",
                          isActive 
                            ? "bg-navy text-white shadow-md" 
                            : "text-text-secondary hover:bg-gray-100 hover:text-text-primary"
                        )}
                        onClick={onClose}
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              {/* Footer */}
              <motion.div 
                className="p-4 border-t border-gray-200"
                variants={childVariants}
              >
                <Button
                  asChild
                  className="w-full gap-2"
                >
                  <Link href="/add-allocation">
                    <PlusIcon className="w-4 h-4" />
                    Add Allocation
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;