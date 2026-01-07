'use client';

import { useQuery } from '@tanstack/react-query';

async function fetchTrialCount(): Promise<number> {
  try {
    const res = await fetch('/api/trials');
    const data = await res.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching trial count:', error);
    return 420; // Default fallback
  }
}

export function useTrialCount() {
  const { data: trialCount = 420, isLoading, error } = useQuery({
    queryKey: ['trialCount'],
    queryFn: fetchTrialCount,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  return {
    trialCount,
    isLoading,
    error,
  };
}
