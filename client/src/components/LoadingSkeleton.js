import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto pb-12 animate-pulse">
      <div className="h-8 w-48 bg-gray-300 rounded mx-auto mb-6"></div>
      
      <div className="relative rounded-lg overflow-hidden mb-8">
        {/* Cover Photo Skeleton */}
        <div className="relative h-48 mb-16 rounded-lg bg-gray-300"></div>
        
        {/* Profile Picture Skeleton */}
        <div className="absolute left-6 -bottom-16">
          <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white"></div>
        </div>
        
        <div className="relative p-6 mt-8">
          {/* Basic Info Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Social Links Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>

          {/* Directory Listings Skeleton */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="h-10 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Events Section Skeleton */}
          <div className="mb-8">
            <div className="h-4 w-28 bg-gray-300 rounded mb-4"></div>
            <div className="flex flex-wrap gap-2 mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-32 bg-gray-300 rounded-full"></div>
              ))}
            </div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>

          {/* Text Areas Skeleton */}
          {[1, 2].map((i) => (
            <div key={i} className="mb-8">
              <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton; 