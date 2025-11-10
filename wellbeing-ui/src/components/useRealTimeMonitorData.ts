import { useState, useEffect } from 'react';

// Define the shape of the data we expect from the API
interface InsightsResponse {
  primary_state: string;
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

// This is the API endpoint we are connecting to
const API_URL = 'http://127.0.0.1:8000/student/insights';

export function useRealTimeMonitorData() {
  // We'll use our own "dummy" data as the starting point
  const [classFocus, setClassFocus] = useState(72);
  const [classStress, setClassStress] = useState(38);
  const [activeStudents, setActiveStudents] = useState(0); // Start at 0
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This function will fetch the data
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }
        
        const data: InsightsResponse = await response.json();

        // --- THIS IS THE "HACK" ---
        // We set Focus and Stress from the REAL data
        setClassFocus(data.probabilities.focus * 100);
        setClassStress(data.probabilities.stress * 100);
        
        // We'll set active students to 1 (which is true)
        setActiveStudents(1); 
        
        if (error) setError(null); // Clear error on success

      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
        // If it fails, just show 1 student and keep old data
        setActiveStudents(1);
      }
    };

    // Call it immediately when the component loads
    fetchData();

    // Set up an interval to poll the backend every 2.5 seconds
    const interval = setInterval(fetchData, 2500);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [error]); 

  // Return the live data for the component to use
  return { classFocus, classStress, activeStudents, error };
}