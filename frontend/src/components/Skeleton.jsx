import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-[#f0f4ee] rounded-xl ${className}`} />
);

export default Skeleton;

/**
 * Skeleton for Product Cards used in Listing and Home
 */
export const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col h-full border border-[#f0f4ee]">
    <Skeleton className="w-full h-36 sm:h-52 rounded-none" />
    <div className="px-4 py-4 sm:pt-4 sm:pb-5 flex flex-col gap-3 flex-1">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-8 rounded-md" />
        </div>
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <div className="flex justify-between items-center mt-auto pt-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 sm:h-10 w-16 sm:w-20 rounded-xl" />
      </div>
    </div>
  </div>
);

/**
 * Skeleton for Gardener Cards
 */
export const GardenerSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8ede6] flex flex-col gap-4 h-64">
    <div className="flex items-center gap-4">
      <Skeleton className="w-14 h-14 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="flex justify-between items-center mt-auto pt-2">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
  </div>
);

/**
 * Skeleton for Appointment Cards
 */
export const AppointmentSkeleton = () => (
  <div className="bg-white rounded-2xl border border-[#e8ede6] shadow-sm p-5 flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className="flex gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-12 w-full rounded-xl" />
    <div className="flex gap-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
    <Skeleton className="h-3 w-2/3" />
    <div className="flex justify-between items-center pt-3 border-t border-[#f0f4ee]">
      <Skeleton className="h-3.5 w-20" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  </div>
);

/**
 * Skeleton for Product Detail View
 */
export const ProductViewSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-10 items-start">
    <div className="w-full md:w-1/2 flex flex-col gap-4">
      <Skeleton className="w-full aspect-square rounded-3xl" />
      <div className="flex gap-3">
        <Skeleton className="w-20 h-20 rounded-xl" />
        <Skeleton className="w-20 h-20 rounded-xl" />
        <Skeleton className="w-20 h-20 rounded-xl" />
      </div>
    </div>
    <div className="w-full md:w-1/2 flex flex-col gap-6">
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-5 w-24" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-8 w-40 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-12 w-28 rounded-xl" />
        <Skeleton className="flex-1 h-12 rounded-xl" />
      </div>
      <div className="flex gap-6 py-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  </div>
);
