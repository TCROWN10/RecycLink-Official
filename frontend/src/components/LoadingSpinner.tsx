import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-32 w-32'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${sizeClasses[size]} ${className}`}></div>
    </div>
  );
};

export default LoadingSpinner; 