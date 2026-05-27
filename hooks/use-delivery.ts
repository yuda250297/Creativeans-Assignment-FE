import { useState, useCallback } from 'react';
import { getDeliveries } from '@/services/delivery';

export const useGetDeliveries = () => {
  const [deliveries, setDeliveries] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveries = useCallback(async (params?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    // console.log("Fetching deliveries...");
    try {
      const data = await getDeliveries(params);
      // console.log(data);
      setDeliveries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deliveries, fetchDeliveries, isLoading, error };
};
