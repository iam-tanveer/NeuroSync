import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Brain, Activity, Music, Play, Pause, Volume2, VolumeX, Loader2, XCircle } from 'lucide-react';
import { AssistiveLearningTools } from './AssistiveLearningTools';
import { useMuseData } from './useMuseData'; // <-- We import our data hook

export function LiveSession() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [binauralBeatsActive, setBinauralBeatsActive] = useState(false);

  // --- This is our REAL data hook ---
  const { 
    focusScore, 
    stressScore, // <-- This is the correct variable name
    sessionDuration, 
    primaryState, 
    isLoading, 
    error 
  } = useMuseData(isSessionActive);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFocusColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-amber-600';
  };
  
  const getStressColor = (level: number) => {
    if (level >= 60) return 'text-red-600';
    if (level >= 40) return 'text-amber-600';
    return 'text-green-600';
  };

  // Helper to show a loading/error/data state
  const renderMetric = (value: number, colorClass: string) => {
    if (error) return <span className="text-red-500">Error</span>;
    // Show loading spinner for the first 5 seconds of the session
    if (isLoading && sessionDuration < 5) return <Loader2 className="w-6 h-6 animate-spin text-slate-400" />;
    // Once data is flowing, show the value
    return <span className={colorClass}>{value.toFixed(0)}%</span>;
  };

  return (
    <div className="space-y-4">
      {/* Session Controls */}
      <Card className="border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-purple-900">Study Session</CardTitle>
              <CardDescription>Track your cognitive performance in real-time</CardDescription>
            </div>
            <div className="text-purple-900 text-2xl font-semibold">
              {formatTime(sessionDuration)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              onClick={() => setIsSessionActive(!isSessionActive)}
              className="flex-1"
              variant={isSessionActive ? 'destructive' : 'default'}
              size="lg"
            >
              {isSessionActive ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  End Session
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start Session
                </>
              )}
            </Button>
            <Button
              onClick={() => setAudioEnabled(!audioEnabled)}
              variant="outline"
              size="lg"
            >
              {audioEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* This is our new Error/Loading bar */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Connection Error:</strong> {error}. Is the backend running?
              </AlertDescription>
            </Alert>
          )}
          {isLoading && !error && isSessionActive && (
            <Alert className="border-blue-500 bg-blue-50">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <AlertDescription className="text-blue-900">
                Connecting to Muse stream... (Waiting for 10s of data)
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Focus Score */}
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-blue-900">Focus Score</CardTitle>
              </div>
              {isSessionActive && !error && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold">
                {renderMetric(focusScore, getFocusColor(focusScore))}
              </div>
              <Progress value={focusScore} className="h-4" />
              <div className="flex justify-between text-slate-600">
                <span>Low</span>
                <span className="font-medium">{primaryState === 'focus' ? 'Focused' : '...'}</span>
                <span>High</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stress Level */}
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                <CardTitle className="text-amber-900">Stress Level</CardTitle>
              </div>
              {isSessionActive && !error && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold">
                {/* THIS WAS THE BUG. 
                  It used to say getStressColor(stressLevel).
                  It now correctly uses stressScore.
                */}
                {renderMetric(stressScore, getStressColor(stressScore))}
              </div>
              <Progress value={stressScore} className="h-4" />
              <div className="flex justify-between text-slate-600">
                <span>Low</span>
                <span className="font-medium">{primaryState === 'stress' ? 'Stressed' : '...'}</span>
                <span>High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assistive Learning Tools */}
      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900">Assistive Learning Tools</CardTitle>
          <CardDescription>Accessibility features for inclusive learning</CardDescription>
        </CardHeader>
        <CardContent>
          <AssistiveLearningTools />
        </CardContent>
      </Card>
    </div>
  );
}