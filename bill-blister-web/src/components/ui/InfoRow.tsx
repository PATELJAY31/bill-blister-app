import React from 'react';

interface InfoRowProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ 
  label, 
  value, 
  icon, 
  onClick, 
  className = '' 
}) => {
  return (
    <div 
      className={`flex items-center justify-between py-3 px-4 border-b border-gray-200 last:border-b-0 ${
        onClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex-shrink-0 text-gray-400">
            {icon}
          </div>
        )}
        <span className="text-sm font-medium text-gray-900">
          {label}
        </span>
      </div>
      <span className="text-sm text-gray-600">
        {value}
      </span>
    </div>
  );
};

export default InfoRow;