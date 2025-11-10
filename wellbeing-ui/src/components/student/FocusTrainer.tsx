import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Trophy, Target, Star, Zap, Brain, Award, Loader2 } from 'lucide-react';
import { useMuseData } from './useMuseData'; // <-- We import our REAL data hook!

export function FocusTrainer() {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingTime, setTrainingTime] = useState(0);
  const [targetScore, setTargetScore] = useState(75); // Target to beat
  const [points, setPoints] = useState(850);
  const [streak, setStreak] = useState(5);
  const [currentTip, setCurrentTip] = useState('');

  // --- THIS IS THE REAL DATA ---
  // We get the live focus score from our custom hook.
  // The hook only fetches when isTraining is true.
  const { focusScore, isLoading, error } = useMuseData(isTraining);
  // --- END REAL DATA ---

  const tips = [
    'Try focusing on your breathing',
    'Clear your mind of distractions',
    'Visualize a calm, peaceful place',
    'Count your breaths slowly',
    'Notice your body relaxing',
    'Let thoughts pass without judgment',
    'Focus on a single point',
    'Feel the rhythm of your heartbeat',
  ];

  // This effect handles the training timer
  useEffect(() => {
    if (!isTraining) return;

    const timerInterval = setInterval(() => {
      setTrainingTime(prev => prev + 1);
      
      // Change tip every 8 seconds
      if (trainingTime % 8 === 0) {
        setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isTraining, trainingTime]); // Removed tips from dependency array

  // This new effect handles awarding points based on the REAL focusScore
  useEffect(() => {
    if (isTraining && !isLoading && focusScore >= targetScore) {
      // Award 10 points for every second you are above the target
      setPoints(p => p + 10);
    }
  }, [focusScore, isTraining, isLoading, targetScore]);


  const startTraining = () => {
    setIsTraining(true);
    setTrainingTime(0);
    setCurrentTip(tips[0]);
  };

  const stopTraining = () => {
    setIsTraining(false);
    // Mock logic for streak, this is fine
    if (trainingTime >= 60) {
      setStreak(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFocusStatus = () => {
    if (focusScore >= targetScore) return { text: 'Excellent!', color: 'text-green-600', bg: 'bg-green-100' };
    if (focusScore >= 60) return { text: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { text: 'Keep Trying', color: 'text-amber-600', bg: 'bg-amber-100' };
  };

  const status = getFocusStatus();

  // Mock achievements are PERFECT for a hackathon
  const achievements = [
    { name: 'First Session', desc: 'Complete your first training', earned: true },
    { name: 'Focus Master', desc: 'Maintain 80+ focus for 5 min', earned: true },
    { name: '5 Day Streak', desc: 'Train 5 days in a row', earned: true },
    { name: '10 Day Streak', desc: 'Train 10 days in a row', earned: false },
    { name: 'Zen Master', desc: 'Maintain 90+ focus for 10 min', earned: false },
    { name: '1000 Points', desc: 'Earn 1000 total points', earned: false },
  ];
  
  // Helper to show a loading/error/data state
  const renderFocusScore = () => {
    if (error) return <span className="text-red-500">Error</span>;
    if (isLoading && trainingTime < 5) return <Loader2 className="w-6 h-6 animate-spin text-slate-400" />;
    return <span className={status.color}>{focusScore.toFixed(0)}%</span>;
  };

  return (
    <div className="space-y-4">
      {/* Training Stats Header (Mock data is fine) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-slate-500">Total Points</div>
                <div className="text-purple-900">{points}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-slate-500">Current Streak</div>
                <div className="text-blue-900">{streak} days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-slate-500">Achievements</div>
                <div className="text-green-900">3/6 unlocked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Interface */}
      <Card className="border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-indigo-900">Focus Training Session</CardTitle>
              <CardDescription>Practice maintaining high focus levels</CardDescription>
            </div>
            {!isLoading && isTraining && (
               <Badge className={status.bg + ' ' + status.color}>{status.text}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Focus Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                <span className="text-indigo-900">Current Focus</span>
              </div>
              <div className="flex items-center gap-2">
                {renderFocusScore()}
                {isTraining && !error && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
            <div className="relative">
              <Progress value={focusScore} className="h-6" />
              {/* Target Line */}
              <div 
                className="absolute top-0 h-6 w-1 bg-red-500" 
                style={{ left: `${targetScore}%` }}
                title={`Target: ${targetScore}%`}
              />
            </div>
            <div className="flex justify-between text-slate-600">
              <span>0%</span>
              <span className="text-red-600 font-medium">Target: {targetScore}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Timer & Controls */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <div className="text-slate-500">Training Time</div>
              <div className="text-indigo-900 text-2xl font-semibold">
                {formatTime(trainingTime)}
              </div>
            </div>
            <Button
              onClick={isTraining ? stopTraining : startTraining}
              size="lg"
              variant={isTraining ? 'destructive' : 'default'}
            >
              {isTraining ? 'End Training' : 'Start Training'}
            </Button>
          </div>

          {/* Current Tip */}
          {isTraining && currentTip && (
            <Alert className="border-blue-500 bg-blue-50">
              <Target className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <strong>Focus Tip:</strong> {currentTip}
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>

      {/* Achievements (Mocked, which is fine) */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Achievements</CardTitle>
          <CardDescription>Unlock rewards by training regularly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${
                  achievement.earned
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.earned ? 'bg-yellow-200' : 'bg-slate-200'
                  }`}>
                    {achievement.earned ? (
                      <Trophy className="w-5 h-5 text-yellow-700" />
                    ) : (
                      <Trophy className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className={achievement.earned ? 'text-yellow-900 font-medium' : 'text-slate-500'}>
                      {achievement.name}
                    </div>
                    <div className="text-slate-600 text-sm">{achievement.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}