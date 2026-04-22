import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-[#f0f4ee] rounded-xl ${className}`} />
);

export default Skeleton;

/**
 * Skeleton for standard Admin Tables
 * @param {number} rows - Number of rows to show
 * @param {number} cols - Number of columns to show
 * @param {boolean} hasImage - Whether the first column is an image thumbnail
 */
export const AdminTableSkeleton = ({ rows = 5, cols = 5, hasImage = false }) => (
  <div className="w-full bg-white">
    {/* Table Header Placeholder */}
    <div className="bg-[#fcfdfc] border-b border-[#f0f4ee] px-6 py-4 flex gap-4">
       {hasImage && <div className="w-10 shrink-0" />}
       {Array(cols - (hasImage ? 1 : 0)).fill(0).map((_, i) => (
         <div key={i} className="flex-1">
           <Skeleton className="h-3 w-16 opacity-50" />
         </div>
       ))}
    </div>
    
    {/* Table Rows Placeholder */}
    {Array(rows).fill(0).map((_, rowIndex) => (
      <div key={rowIndex} className={`border-b border-[#f0f4ee] px-6 py-5 flex items-center gap-4 ${rowIndex === rows - 1 ? 'border-0' : ''}`}>
        {hasImage && (
          <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        )}
        {Array(cols - (hasImage ? 1 : 0)).fill(0).map((__, colIndex) => (
          <div key={colIndex} className="flex-1">
             <Skeleton className={`h-4 ${colIndex === 0 ? 'w-3/4' : 'w-1/2'}`} />
          </div>
        ))}
      </div>
    ))}
  </div>
);

/**
 * Skeleton for Dashboard Stats
 */
export const AdminStatSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {Array(4).fill(0).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8ede6] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="w-9 h-9 rounded-xl" />
        </div>
        <div className="flex items-end justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);
