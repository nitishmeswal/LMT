'use client';

import { useQuery } from '@tanstack/react-query';

interface TrialData {
  [doseId: string]: number;
}

async function fetchAllTrialCounts(): Promise<TrialData> {
  try {
    const res = await fetch('/api/trials');
    const data = await res.json();
    return data.trials || {};
  } catch (error) {
    console.error('Error fetching trial counts:', error);
    return {};
  }
}

export function useTrialCount() {
  const { data: trialCounts = {}, isLoading, error, refetch } = useQuery<TrialData>({
    queryKey: ['trialCounts'],
    queryFn: fetchAllTrialCounts,
    staleTime: 15 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  });

  const getTrialCount = (doseId: string): number => {
    return trialCounts[doseId] ?? 420;
  };

  const getTotalRemaining = (): number => {
    const values = Object.values(trialCounts);
    if (values.length === 0) return 420;
    return Math.min(...values);
  };

  const trialCount = getTotalRemaining();

  return {
    trialCount,
    trialCounts,
    getTrialCount,
    isLoading,
    error,
    refetch,
  };
}
