
import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700/50 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600">
      {icon && (
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-full text-gray-400 dark:text-gray-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
};
