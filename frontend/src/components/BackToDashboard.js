import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BackToDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Don't render on dashboard or landing pages
  if (location.pathname === '/' || 
      location.pathname === '/app' || 
      location.pathname === '/app/dashboard' ||
      location.pathname === '/dashboard' ||
      location.pathname === '/login') {
    return null;
  }

  const handleBackToDashboard = () => {
    navigate('/app/dashboard');
  };

  return (
    <div className="mb-6">
      <button
        onClick={handleBackToDashboard}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors duration-200 group"
        aria-label="Back to Dashboard"
      >
        <svg 
          className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
        Back to Dashboard
      </button>
    </div>
  );
};

export default BackToDashboard;
