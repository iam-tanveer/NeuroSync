import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Brain, Activity, Users, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useRealTimeMonitorData } from './useRealTimeMonitorData'; // <-- IMPORT OUR NEW HOOK
import { Alert, AlertDescription } from './ui/alert';

export function RealTimeMonitor() {
  // --- This is the REAL DATA from our hook ---
  const { classFocus, classStress, activeStudents, error } = useRealTimeMonitorData();
  
  // --- This is the MOCK DATA for Engagement ---
  // We keep this one random, just as you suggested!
  const [classEngagement, setClassEngagement] = useState(78);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setClassEngagement(prev => Math.max(50, Math.min(100, prev + (Math.random() - 0.5) * 7)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  // --- END MOCK/REAL HYBRID ---


  // --- This is all MOCK DATA, which is PERFECT for the demo ---
  const stateDistribution = [
    { name: 'Highly Focused', value: 35, color: '#3b82f6' },
    { name: 'Engaged', value: 32, color: '#06b6d4' },
    { name: 'Neutral', value: 18, color: '#8b5cf6' },
    { name: 'Mind Wandering', value: 10, color: '#f59e0b' },
    { name: 'Stressed', value: 5, color: '#ef4444' },
  ];
  // --- End Mock Data ---


  const getFocusColor = (value: number) => {
    if (value >= 75) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    return 'text-amber-600';
  };

  const getStressColor = (value: number) => {
    if (value >= 60) return 'text-red-600';
    if (value >= 40) return 'text-amber-600';
    return 'text-green-600';
  };
  
  // Helper to show a loading/error/data state
  const renderMetric = (value: number, colorClass: string) => {
    if (error) return <span className="text-red-500">Error</span>;
    if (activeStudents === 0) return <Loader2 className="w-6 h-6 animate-spin text-slate-400" />;
    return <span className={colorClass}>{value.toFixed(1)}%</span>;
  };

  return (
    <div className="space-y-4">
      {/* Live Status Banner */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
          </div>
          <div>
            <div className="text-green-900">Live Session Active</div>
            <div className="text-green-600">{activeStudents} student connected</div>
          </div>
        </div>
        <Badge variant="outline" className="bg-white border-green-600 text-green-700">
          Real-Time Data
        </Badge>
      </div>

      {/* Connection Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Backend Connection Error:</strong> {error}. Is api_connected.py running?
          </AlertDescription>
        </Alert>
      )}

      {/* Real-Time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Class Focus Meter (REAL) */}
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-blue-900">Class Focus</CardTitle>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold">
                {renderMetric(classFocus, getFocusColor(classFocus))}
              </div>
              <Progress value={classFocus} className="h-3" />
              <div className="flex justify-between text-slate-600">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class Stress Level (REAL) */}
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                <CardTitle className="text-amber-900">Stress Level</CardTitle>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
               <div className="text-3xl font-bold">
                {renderMetric(classStress, getStressColor(classStress))}
              </div>
              <Progress value={classStress} className="h-3" />
              <div className="flex justify-between text-slate-600">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class Engagement (RANDOM) */}
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                <CardTitle className="text-green-900">Engagement</CardTitle>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold">
                <span className={getFocusColor(classEngagement)}>{classEngagement.toFixed(1)}%</span>
              </div>
              <Progress value={classEngagement} className="h-3" />
              <div className="flex justify-between text-slate-600">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* State Distribution (STAYS MOCKED) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <Card className="border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-purple-900">Student State Distribution</CardTitle>
            </div>
            <CardDescription>Real-time anonymous cognitive states</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stateDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stateDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">State Breakdown</CardTitle>
            <CardDescription>Number of students in each state</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stateDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-15} 
                  textAnchor="end" 
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" name="Percentage">
                  {stateDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}