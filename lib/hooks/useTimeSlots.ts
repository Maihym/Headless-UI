'use client';

import { useState, useEffect } from 'react';
import type { TimeSlot } from '@/types/booking';

interface UseTimeSlotsResult {
  timeSlots: TimeSlot[];
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
 * Custom hook to fetch time slots for a specific date
 */
export function useTimeSlots(date: Date | undefined): UseTimeSlotsResult {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      setTimeSlots([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchTimeSlots = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const dateStr = date.toISOString().split('T')[0];
        const response = await fetchWithTimeout(
          `/api/availability?date=${dateStr}`,
          { signal: controller.signal },
          10000
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch time slots');
        }

        const data = await response.json();
        
        // API response interface
        interface ApiSlot {
          id: string;
          start: string;
          end: string;
          time: string;
        }
        
        // Convert API response to TimeSlot format
        const slots: TimeSlot[] = data.slots.map((slot: ApiSlot) => {
          const start = new Date(slot.start);
          const end = new Date(slot.end);
          
          return {
            id: `${dateStr}-${start.getHours()}-${start.getMinutes()}`,
            start,
            end,
            time: slot.time,
          };
        });

        setTimeSlots(slots);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Error fetching time slots:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setTimeSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeSlots();
    
    return () => {
      controller.abort();
    };
  }, [date]);

  return { timeSlots, isLoading, error };
}

