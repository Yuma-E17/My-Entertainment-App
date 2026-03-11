import React from 'react';

export const SkeletonCard = ({ wide = false }) => {
  if (wide) {
    return (
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
        <div className="p-6 flex gap-6 items-center">
          <div className="w-24 h-32 bg-white/10 rounded-xl" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/10 rounded w-1/2" />
            <div className="h-4 bg-white/10 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-white/10" />
      <div className="p-8 space-y-4">
        <div className="h-5 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  );
};