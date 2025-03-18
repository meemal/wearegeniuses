import React from 'react';

const LoadingProgress = ({ stage }) => {
  const stages = [
    'Authenticating...',
    'Loading profile data...',
    'Loading images...',
    'Loading events...',
    'Preparing form...'
  ];

  const currentIndex = stages.indexOf(stage);
  const progress = ((currentIndex + 1) / stages.length) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-amber-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Loading Message */}
      <div className="bg-white shadow-md px-4 py-2 text-center text-sm text-gray-600">
        {stage}
      </div>
    </div>
  );
};

export default LoadingProgress; 