import { useState, useCallback } from 'react';
import { getLocations } from '../services/location';

export const useGetLocations = () => {
  const [locations, setLocations] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async (params?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    // console.log("Fetching locations...");
    try {
      const data = await getLocations(params);
      console.log(data);
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { locations, fetchLocations, isLoading, error };
};
