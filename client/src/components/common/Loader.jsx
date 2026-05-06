import React from 'react';

/**
 * Reusable Loader component with spinner animation
 */
const Loader = ({ 
  size = 'md', 
  color = 'border-blue-500 bg-blue-50', 
  fullScreen = false, 
  inline = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50' 
    : inline 
    ? 'flex items-center justify-center' 
    : 'flex items-center justify-center py-4';

  return (
    <div className={containerClasses}>
      <div 
        className={`${sizeClasses[size]} ${color} border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

export default Loader;

