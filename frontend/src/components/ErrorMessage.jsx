import React from 'react';
import { HiExclamationCircle, HiXMark } from 'react-icons/hi2';

const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm transition-all duration-200">
      <HiExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
      <div className="flex-1 font-medium">{message}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-700 transition-colors p-1"
          aria-label="Dismiss error"
        >
          <HiXMark className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
