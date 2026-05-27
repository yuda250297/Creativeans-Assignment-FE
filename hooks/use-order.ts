import { useState, useCallback } from 'react';
import { getOrders } from '@/services/order';

export const useGetOrders = () => {
  const [orders, setOrders] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (params?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    // console.log("Fetching orders...");
    try {
      const data = await getOrders(params);
      // console.log(data);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { orders, fetchOrders, isLoading, error };
};
