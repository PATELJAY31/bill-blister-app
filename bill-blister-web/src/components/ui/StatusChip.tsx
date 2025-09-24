import React from 'react';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ClaimStatus } from '@/types';

interface StatusChipProps {
  status: ClaimStatus;
  compact?: boolean;
  className?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ status, compact = false, className = '' }) => {
  const getStatusConfig = (status: ClaimStatus) => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircleIcon,
          text: 'Approved',
          className: 'status-chip status-approved',
        };
      case 'pending':
        return {
          icon: ClockIcon,
          text: 'Pending',
          className: 'status-chip status-pending',
        };
      case 'rejected':
        return {
          icon: XCircleIcon,
          text: 'Rejected',
          className: 'status-chip status-rejected',
        };
      default:
        return {
          icon: ClockIcon,
          text: 'Unknown',
          className: 'status-chip status-info',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`${config.className} ${className}`}>
      <Icon className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
      {!compact && <span className="ml-1">{config.text}</span>}
    </span>
  );
};

export default StatusChip;