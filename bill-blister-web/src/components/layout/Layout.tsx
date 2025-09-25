'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showActions?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showActions = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleNotificationClick = () => {
    router.push('/notifications');
  };

  const handleAddClick = () => {
    router.push('/expense-claim/new');
  };

  const handleFilterClick = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationClick={handleNotificationClick}
          onAddClick={handleAddClick}
          onFilterClick={handleFilterClick}
          title={title}
          showActions={showActions}
        />
        
        <motion.main 
          className="p-6 max-w-7xl mx-auto"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;