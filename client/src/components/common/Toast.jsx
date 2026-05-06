import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

/**
 * Toast configuration and wrapper component
 */

// Configure default toast options
toast.configure({
  position: 'top-right',
  duration: 4000,
  style: {
    background: 'white',
    color: '#1f2937',
    boxShadow: '0 10px 15px -3px rgba(0 0 0 0.1), 0 4px 6px -2px rgba(0 0 0 0.05)',
    borderRadius: '8px',
    padding: '12px 16px',
  },
});

// Custom toast variants
export const showSuccess = (message) => {
  toast((t) => (
    <div className="flex items-center gap-2">
      <CheckCircleIcon className="w-5 h-5 text-green-500" />
      <span>{message}</span>
    </div>
  ), { 
    style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }
  });
};

export const showError = (message) => {
  toast((t) => (
    <div className="flex items-center gap-2">
      <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      <span>{message}</span>
    </div>
  ), { 
    style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }
  });
};

export const showWarning = (message) => {
  toast((t) => (
    <div className="flex items-center gap-2">
      <InformationCircleIcon className="w-5 h-5 text-amber-500" />
      <span>{message}</span>
    </div>
  ), { 
    style: { background: '#fffbeb', color: '#92400e', border: '1px solid #fcd34d' }
  });
};

export const showInfo = (message) => {
  toast((t) => (
    <div className="flex items-center gap-2">
      <InformationCircleIcon className="w-5 h-5 text-blue-500" />
      <span>{message}</span>
    </div>
  ));
};

// Toast wrapper component (use in App.jsx or main.jsx)
const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerStyle={{}}
      containerClassName=""
      toastOptions={{
        duration: 4000,
        style: {
          background: 'white',
          color: '#1f2937',
          boxShadow: '0 10px 15px -3px rgba(0 0 0 0.1)',
        },
      }}
    />
  );
};

export default ToastProvider;

