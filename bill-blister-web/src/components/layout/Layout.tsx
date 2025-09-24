'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`main-content ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationClick={handleNotificationClick}
          onAddClick={handleAddClick}
          onFilterClick={handleFilterClick}
          title={title}
          showActions={showActions}
        />
        
        <main className="fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;