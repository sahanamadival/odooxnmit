import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ 
  initialDuration = 0, 
  isRunning = false, 
  onDurationChange,
  expectedDuration = 0,
  className = ""
}) => {
  const [duration, setDuration] = useState(initialDuration);
  const [isActive, setIsActive] = useState(isRunning);
  const intervalRef = useRef(null);

  useEffect(() => {
    setDuration(initialDuration);
  }, [initialDuration]);

  useEffect(() => {
    setIsActive(isRunning);
  }, [isRunning]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setDuration(prevDuration => {
          const newDuration = prevDuration + 1;
          if (onDurationChange) {
            onDurationChange(newDuration);
          }
          return newDuration;
        });
      }, 60000); // Update every minute
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, onDurationChange]);

  const formatDuration = (minutes) => {
    if (minutes === 0) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const getProgressPercentage = () => {
    if (expectedDuration === 0) return 0;
    return Math.min((duration / expectedDuration) * 100, 100);
  };

  const getStatusColor = () => {
    if (duration === 0) return 'text-gray-500';
    if (duration <= expectedDuration) return 'text-green-600';
    if (duration <= expectedDuration * 1.1) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center space-x-2">
        <span className={`font-medium ${getStatusColor()}`}>
          {formatDuration(duration)}
        </span>
        {isActive && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Running</span>
          </div>
        )}
      </div>
      
      {expectedDuration > 0 && (
        <div className="mt-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                duration <= expectedDuration 
                  ? 'bg-green-500' 
                  : duration <= expectedDuration * 1.1 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Expected: {formatDuration(expectedDuration)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;