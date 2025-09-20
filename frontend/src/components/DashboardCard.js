import React from 'react';

const DashboardCard = ({ title, value, icon, color = 'blue', onClick, trend, trendValue, loading = false }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-primary-50 to-primary-100',
      border: 'border-primary-200',
      text: 'text-primary-700',
      iconBg: 'bg-primary-500',
      accent: 'border-l-primary-500'
    },
    green: {
      bg: 'bg-gradient-to-br from-success-50 to-success-100',
      border: 'border-success-200',
      text: 'text-success-700',
      iconBg: 'bg-success-500',
      accent: 'border-l-success-500'
    },
    yellow: {
      bg: 'bg-gradient-to-br from-warning-50 to-warning-100',
      border: 'border-warning-200',
      text: 'text-warning-700',
      iconBg: 'bg-warning-500',
      accent: 'border-l-warning-500'
    },
    red: {
      bg: 'bg-gradient-to-br from-danger-50 to-danger-100',
      border: 'border-danger-200',
      text: 'text-danger-700',
      iconBg: 'bg-danger-500',
      accent: 'border-l-danger-500'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-purple-200',
      text: 'text-purple-700',
      iconBg: 'bg-purple-500',
      accent: 'border-l-purple-500'
    },
    indigo: {
      bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
      iconBg: 'bg-indigo-500',
      accent: 'border-l-indigo-500'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  if (loading) {
    return (
      <div className="card-hover animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-secondary-200 rounded w-1/2"></div>
          </div>
          <div className="w-12 h-12 bg-secondary-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card-interactive ${colors.bg} ${colors.border} ${colors.accent} border-l-4 group`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colors.text} mb-2`}>{value}</p>
          {trend && trendValue && (
            <div className="flex items-center space-x-1">
              <svg 
                className={`w-4 h-4 ${trend === 'up' ? 'text-success-500' : 'text-danger-500'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {trend === 'up' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                )}
              </svg>
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          <span className="text-2xl text-white">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
