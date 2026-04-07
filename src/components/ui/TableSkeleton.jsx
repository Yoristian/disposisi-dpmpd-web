import React from 'react';

const TableSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="animate-pulse flex flex-col gap-5">
      {/* Header Skeleton */}
      <div className="flex gap-4 items-center pb-4 border-b border-gray-100">
        <div className="h-4 bg-gray-200 rounded-md w-1/12"></div>
        <div className="h-4 bg-gray-200 rounded-md w-3/12"></div>
        <div className="h-4 bg-gray-200 rounded-md w-4/12"></div>
        <div className="h-4 bg-gray-200 rounded-md w-2/12"></div>
        <div className="h-4 bg-gray-200 rounded-md w-2/12"></div>
      </div>
      
      {/* Body Skeletons */}
      {[1, 2, 3, 4, 5].map(n => (
        <div key={n} className="flex gap-4 items-center py-2">
          <div className="h-4 bg-gray-50 rounded-md w-1/12"></div>
          <div className="h-4 bg-gray-50 rounded-md w-3/12"></div>
          <div className="h-4 bg-gray-50 rounded-md w-4/12"></div>
          <div className="h-4 bg-gray-50 rounded-md w-2/12"></div>
          <div className="h-4 bg-gray-50 rounded-md w-2/12"></div>
        </div>
      ))}
    </div>
  </div>
);

export default TableSkeleton;