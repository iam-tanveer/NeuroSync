import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

// This is the "contract" for the data we expect from your Python backend
interface ApiData {
  primary_state: 'focus' | 'calm' | 'stress' | 'neutral';
  probabilities: {
    focus: number;
    calm: number;
    stress: number;
    neutral: number;
  };
  ppg_metrics: {
    bpm: number | null;
    rmssd: number | null;
  };
}

// This is the clean data our hook will provide to the UI
export interface MuseDataState {
  focusScore: number;
  stressScore: number;
  primaryState: string;
  bpm: number | null;
  sessionDuration: number;
  isLoading: boolean;
  error: string | null;
}

// The URL of your Python backend
const API_URL = 'http://127.0.0.1:8000/student/insights?window_seconds=10';

/**
 * This is a custom React hook that polls the backend for live Muse data.
 * @param isSessionActive - The hook will only fetch data if this is true.
 */
export function useMuseData(isSessionActive: boolean): MuseDataState {
  const [data, setData] = useState<MuseDataState>({
    focusScore: 0,
    stressScore: 0,
    primaryState: 'neutral',
    bpm: null,
    sessionDuration: 0,
    isLoading: false,
    error: null,
  });

  // Use a ref for the interval ID to safely clear it
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // This function fetches the data from your Python API
    const fetchData = async () => {
      setData(prev => ({ ...prev, isLoading: true }));
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Backend error: ${response.statusText}`);
        }
        
        const json: ApiData = await response.json();

        // Convert the raw probabilities into the 0-100 scores
        // our UI components expect.
        const focus = Math.round(json.probabilities.focus * 100);
        const stress = Math.round(json.probabilities.stress * 100);

        setData(prev => ({
          ...prev,
          focusScore: focus,
          stressScore: stress,
          primaryState: json.primary_state,
          bpm: json.ppg_metrics.bpm,
          isLoading: false,
          error: null,
        }));
        
      } catch (e: any) {
        console.error("Failed to fetch Muse data:", e);
        setData(prev => ({ ...prev, isLoading: false, error: e.message }));
        
        // Show a toast notification to the user
        toast.error('Connection Error', {
          description: 'Could not connect to the Muse backend. Is it running?'
        });
        
        // Stop polling on error
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    if (isSessionActive) {
      // --- Start Fetching ---
      // Fetch immediately on start
      fetchData();
      
      // Then, poll every 3 seconds for new data
      intervalRef.current = setInterval(fetchData, 3000);

      // --- Start Session Timer ---
      sessionTimerRef.current = setInterval(() => {
        setData(prev => ({ ...prev, sessionDuration: prev.sessionDuration + 1 }));
      }, 1000);
      
    } else {
      // --- Stop Fetching ---
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
      // Reset to default state when session ends
      setData({
        focusScore: 0,
        stressScore: 0,
        primaryState: 'neutral',
        bpm: null,
        sessionDuration: 0,
        isLoading: false,
        error: null,
      });
    }

    // Cleanup function to clear intervals when the component unmounts
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [isSessionActive]); // This effect re-runs whenever isSessionActive changes

  return data;
}