'use client';

import { useState, useEffect } from 'react';

interface UseAvailabilityResult {
  availabilityMap: Map<string, number>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Custom hook to fetch calendar availability from the API
 * Returns a Map of date strings to available slot counts
 */
export function useAvailability(startDate?: Date, endDate?: Date): UseAvailabilityResult {
  const [availabilityMap, setAvailabilityMap] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchAvailability = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build query params
        const params = new URLSearchParams();
        if (startDate) {
          params.append('startDate', startDate.toISOString().split('T')[0]);
        }
        if (endDate) {
          params.append('endDate', endDate.toISOString().split('T')[0]);
        }

        const response = await fetchWithTimeout(
          `/api/availability?${params.toString()}`,
          { signal: controller.signal },
          10000
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch availability');
        }

        const data: Array<{ date: string; availableSlots: number }> = await response.json();
        
        // Convert array to Map
        const map = new Map<string, number>();
        data.forEach(item => {
          map.set(item.date, item.availableSlots);
        });

        setAvailabilityMap(map);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Error fetching availability:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
    
    return () => {
      controller.abort();
    };
  }, [startDate, endDate]);

  return { availabilityMap, isLoading, error };
}

