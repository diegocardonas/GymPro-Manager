
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  height?: string | number;
  width?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular', 
  height, 
  width 
}) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700/50";
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`} 
      style={{ height, width }}
    />
  );
};
