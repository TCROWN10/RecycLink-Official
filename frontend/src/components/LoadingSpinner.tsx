import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-32 w-32'
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-4 border-gray-200 ${sizeClasses[size]} ${className}`}
        style={{
          borderTopColor: '#983279',
          borderRightColor: '#983279',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent'
        }}
      />
    </div>
  );
};

export default LoadingSpinner; 