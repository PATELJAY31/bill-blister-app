'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import EmptyState from '@/components/ui/EmptyState';
import { BellIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const mockNotifications = [
  {
    id: '1',
    title: 'Claim Approved',
    message: 'Your expense claim for ₹1,500.00 has been approved by the engineer.',
    type: 'success',
    timestamp: '2024-01-20T10:30:00Z',
    read: false,
  },
  {
    id: '2',
    title: 'Claim Rejected',
    message: 'Your expense claim for ₹125.50 has been rejected. Please check the reason and resubmit.',
    type: 'error',
    timestamp: '2024-01-19T14:20:00Z',
    read: false,
  },
  {
    id: '3',
    title: 'New Allocation',
    message: 'You have received a new cash allocation of ₹300.00 for Travel expenses.',
    type: 'info',
    timestamp: '2024-01-18T09:15:00Z',
    read: true,
  },
  {
    id: '4',
    title: 'Claim Pending',
    message: 'Your expense claim for ₹850.75 is pending engineer verification.',
    type: 'warning',
    timestamp: '2024-01-17T16:45:00Z',
    read: true,
  },
];

const NotificationsPage: React.FC = () => {
  const [notifications] = React.useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-status-success" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-status-error" />;
      case 'warning':
        return <ClockIcon className="w-5 h-5 text-status-warning" />;
      default:
        return <BellIcon className="w-5 h-5 text-status-info" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-status-success-light';
      case 'error':
        return 'bg-status-error-light';
      case 'warning':
        return 'bg-status-warning-light';
      default:
        return 'bg-status-info-light';
    }
  };

  if (notifications.length === 0) {
    return (
      <Layout title="Notifications">
        <EmptyState
          title="No Notifications"
          description="You don't have any notifications yet."
          icon={<BellIcon className="w-12 h-12 text-text-tertiary" />}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Notifications">
      <div className="space-y-6">
        {/* Header */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
              <p className="text-text-secondary">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">Mark all as read</span>
                <button className="text-status-info hover:text-status-success transition-colors">
                  <CheckCircleIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card ${!notification.read ? 'border-l-4 border-l-status-info' : ''} ${
                !notification.read ? 'bg-surface-secondary' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-full ${getNotificationBgColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-text-primary">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        {notification.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-xs text-text-tertiary">
                        {new Date(notification.timestamp).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-status-info rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {notifications.length >= 4 && (
          <div className="text-center">
            <button className="btn-secondary px-6 py-2">
              Load More Notifications
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;
