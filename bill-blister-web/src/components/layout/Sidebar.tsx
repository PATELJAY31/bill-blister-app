'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  BellIcon,
  PlusIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import {
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  BellIcon as BellIconSolid,
  HomeIcon as HomeIconSolid,
} from '@heroicons/react/24/solid';

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

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="sidebar-header">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Bill Blister</h1>
              <button
                onClick={onClose}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav flex-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = isActive ? item.iconSolid : item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/add-allocation"
              className="btn btn-primary w-full justify-center"
            >
              <PlusIcon className="w-4 h-4" />
              Add Allocation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;