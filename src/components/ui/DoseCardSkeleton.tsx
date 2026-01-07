'use client';

import { motion } from 'framer-motion';

export default function DoseCardSkeleton() {
  return (
    <div className="relative glass rounded-2xl p-5 border border-white/10 animate-pulse">
      {/* Top Bar */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-white/10" />
      </div>

      {/* Category Icon */}
      <div className="w-12 h-12 rounded-xl bg-white/10 mb-4" />

      {/* Title & Tagline */}
      <div className="h-5 w-3/4 bg-white/10 rounded mb-2" />
      <div className="h-3 w-1/2 bg-white/10 rounded mb-3" />

      {/* Description */}
      <div className="h-3 w-full bg-white/10 rounded mb-2" />
      <div className="h-3 w-4/5 bg-white/10 rounded mb-4" />

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="h-4 w-16 bg-white/10 rounded" />
        <div className="h-4 w-16 bg-white/10 rounded" />
      </div>

      {/* Frequency Tags */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-20 bg-white/10 rounded-full" />
        <div className="h-6 w-16 bg-white/10 rounded-full" />
      </div>

      {/* Trial Counter */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-white/10 rounded" />
        <div className="h-8 w-20 bg-white/10 rounded-xl" />
      </div>

      {/* Color accent line */}
      <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-white/10" />
    </div>
  );
}

export function DispensarySkeleton() {
  return (
    <div className="min-h-screen pb-32">
      {/* Header Skeleton */}
      <div className="px-4 pt-12 pb-6">
        <div className="h-8 w-40 bg-white/10 rounded mb-2 animate-pulse" />
        <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
      </div>

      {/* Search Skeleton */}
      <div className="px-4 mb-4">
        <div className="h-12 w-full bg-white/10 rounded-xl animate-pulse" />
      </div>

      {/* Categories Skeleton */}
      <div className="px-4 mb-6 flex gap-2 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 bg-white/10 rounded-full flex-shrink-0 animate-pulse" />
        ))}
      </div>

      {/* Cards Grid Skeleton */}
      <div className="px-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <DoseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
