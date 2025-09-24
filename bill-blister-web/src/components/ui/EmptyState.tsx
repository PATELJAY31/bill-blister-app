import React from 'react';
import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';

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
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon">
        {icon || <DocumentTextIcon className="w-8 h-8" />}
      </div>
      
      <h3 className="empty-state-title">
        {title}
      </h3>
      
      <p className="empty-state-description">
        {description}
      </p>
      
      {(actionText || secondaryActionText) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="btn btn-primary"
            >
              <PlusIcon className="w-4 h-4" />
              {actionText}
            </button>
          )}
          
          {secondaryActionText && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="btn btn-secondary"
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;