import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Wind, Play, Pause, Clock, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export function GuidedMeditation() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [duration, setDuration] = useState(5); // minutes
  const [breathPattern, setBreathPattern] = useState('4-4-4');
  const [timeRemaining, setTimeRemaining] = useState(300); // seconds
  const [breathCount, setBreathCount] = useState(0);

  // Parse breath pattern (e.g., "4-4-4" = 4s inhale, 4s hold, 4s exhale)
  const [inhaleTime, holdTime, exhaleTime] = breathPattern.split('-').map(Number);
  const cycleTime = inhaleTime + holdTime + exhaleTime;

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    let phaseTimer: NodeJS.Timeout;
    
    const cycleBreath = () => {
      setPhase('inhale');
      
      setTimeout(() => {
        setPhase('hold');
        
        setTimeout(() => {
          setPhase('exhale');
          setBreathCount(prev => prev + 1);
          
          setTimeout(() => {
            if (isActive) cycleBreath();
          }, exhaleTime * 1000);
        }, holdTime * 1000);
      }, inhaleTime * 1000);
    };

    cycleBreath();

    return () => {
      if (phaseTimer) clearTimeout(phaseTimer);
    };
  }, [isActive, breathPattern]);

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale':
        return 280;
      case 'hold':
        return 280;
      case 'exhale':
        return 140;
      default:
        return 140;
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return '#3b82f6'; // blue
      case 'hold':
        return '#8b5cf6'; // purple
      case 'exhale':
        return '#06b6d4'; // cyan
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startMeditation = () => {
    setIsActive(true);
    setTimeRemaining(duration * 60);
    setBreathCount(0);
    setPhase('inhale');
  };

  const presets = [
    { name: 'Beginner', pattern: '3-2-3', duration: 3 },
    { name: 'Intermediate', pattern: '4-4-4', duration: 5 },
    { name: 'Advanced', pattern: '4-7-8', duration: 10 },
    { name: 'Box Breathing', pattern: '4-4-4-4', duration: 5 },
  ];

  return (
    <div className="space-y-4">
      {/* Session Controls */}
      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900">Guided Meditation</CardTitle>
          <CardDescription>Breathing exercises for stress relief and focus</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-700">Duration (minutes)</label>
              <Select 
                value={duration.toString()} 
                onValueChange={(val) => setDuration(Number(val))}
                disabled={isActive}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-slate-700">Breathing Pattern</label>
              <Select 
                value={breathPattern} 
                onValueChange={setBreathPattern}
                disabled={isActive}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-2-3">3-2-3 (Beginner)</SelectItem>
                  <SelectItem value="4-4-4">4-4-4 (Box Breath)</SelectItem>
                  <SelectItem value="4-7-8">4-7-8 (Relaxation)</SelectItem>
                  <SelectItem value="5-5-5">5-5-5 (Deep Calm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={isActive ? () => setIsActive(false) : startMeditation}
            size="lg"
            className="w-full"
            variant={isActive ? 'destructive' : 'default'}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Stop Meditation
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Meditation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Breathing Visualizer */}
      <Card className="border-purple-200">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Animated Circle */}
            <div className="relative flex items-center justify-center" style={{ height: '320px' }}>
              <motion.div
                animate={{
                  width: getCircleSize(),
                  height: getCircleSize(),
                }}
                transition={{
                  duration: phase === 'inhale' ? inhaleTime : phase === 'exhale' ? exhaleTime : 0.5,
                  ease: 'easeInOut',
                }}
                style={{
                  backgroundColor: getPhaseColor(),
                  borderRadius: '50%',
                  opacity: 0.7,
                }}
              />
              
              {/* Phase Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    key={phase}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-white mb-2"
                    style={{ fontSize: '2rem', fontWeight: 600 }}
                  >
                    {getPhaseText()}
                  </motion.div>
                  {isActive && (
                    <div className="text-white opacity-80">
                      {breathCount} breaths
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timer Display */}
            {isActive && (
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-5 h-5" />
                <span className="text-slate-900">
                  {formatTime(timeRemaining)} remaining
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Presets */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Quick Start Presets</CardTitle>
          <CardDescription>Pre-configured meditation sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presets.map((preset, index) => (
              <div
                key={index}
                className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => {
                  if (!isActive) {
                    setBreathPattern(preset.pattern);
                    setDuration(preset.duration);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-blue-900">{preset.name}</div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">
                    {preset.duration} min
                  </Badge>
                </div>
                <div className="text-slate-600">
                  Pattern: {preset.pattern}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-200 rounded-lg">
                <Wind className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <div className="text-green-900 mb-1">Reduces Stress</div>
                <div className="text-green-700">30% avg reduction after 5 min</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <Heart className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <div className="text-blue-900 mb-1">Improves Focus</div>
                <div className="text-blue-700">25% boost in concentration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-200 rounded-lg">
                <Clock className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <div className="text-purple-900 mb-1">Your Total</div>
                <div className="text-purple-700">45 min this week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Meditation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-slate-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Find a comfortable, quiet space where you won't be disturbed</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Sit upright with your back straight and shoulders relaxed</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Focus on the sensation of breathing, not on breathing perfectly</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>If your mind wanders, gently bring attention back to your breath</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Practice daily for best results - even 3 minutes helps!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
