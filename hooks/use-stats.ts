import { useState, useCallback } from 'react';
import { getDeliveries } from '@/services/delivery';
import { getStats } from '@/services/stat';

export const useGetStats = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (params?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    // console.log("Fetching stats...");
    try {
      const data = await getStats(params);
      console.log(data);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { stats, fetchStats, isLoading, error };
};
