
import React from 'react';
import { AlertProps } from '../types';

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  let bgColor = 'bg-blue-100 border-blue-500 text-blue-700';
  let iconPath = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; // Info icon

  switch (type) {
    case 'error':
      bgColor = 'bg-red-100 border-red-400 text-red-700';
      iconPath = "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"; // Error icon
      break;
    case 'success':
      bgColor = 'bg-green-100 border-green-400 text-green-700';
      iconPath = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"; // Success icon
      break;
    case 'warning':
      bgColor = 'bg-yellow-100 border-yellow-400 text-yellow-700';
      iconPath = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"; // Warning icon
      break;
  }

  return (
    <div className={`border-l-4 p-4 ${bgColor} relative`} role="alert">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
        <p className="font-medium">{message}</p>
      </div>
      {onClose && (
         <button 
            onClick={onClose} 
            className="absolute top-0 bottom-0 right-0 px-4 py-3 text-xl font-semibold"
            aria-label="Close alert"
        >
            &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
