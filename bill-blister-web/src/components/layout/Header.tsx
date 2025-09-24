'use client';

import React from 'react';
import { Bars3Icon, BellIcon, PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';

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
  return (
    <header className="header">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Bars3Icon className="w-6 h-6 text-gray-600" />
        </button>
        
        <h1 className="header-title">{title}</h1>
      </div>

      {/* Right side */}
      {showActions && (
        <div className="header-actions">
          <button
            onClick={onFilterClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Filter"
          >
            <FunnelIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={onAddClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Add New"
          >
            <PlusIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={onNotificationClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            title="Notifications"
          >
            <BellIcon className="w-5 h-5 text-gray-600" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;