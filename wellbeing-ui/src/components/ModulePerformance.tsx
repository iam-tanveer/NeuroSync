import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, TrendingUp, AlertCircle } from 'lucide-react';

export function ModulePerformance() {
  const modules = [
    {
      name: 'Mathematics',
      performance: 92,
      focus: 88,
      stress: 35,
      mindWandering: 15,
      status: 'excellent',
      improvement: 8.5,
    },
    {
      name: 'Computer Science',
      performance: 88,
      focus: 85,
      stress: 42,
      mindWandering: 18,
      status: 'excellent',
      improvement: 6.2,
    },
    {
      name: 'Physics',
      performance: 82,
      focus: 78,
      stress: 48,
      mindWandering: 22,
      status: 'good',
      improvement: 4.1,
    },
    {
      name: 'Literature',
      performance: 75,
      focus: 72,
      stress: 52,
      mindWandering: 28,
      status: 'good',
      improvement: 2.3,
    },
    {
      name: 'Chemistry',
      performance: 68,
      focus: 65,
      stress: 58,
      mindWandering: 35,
      status: 'needs-attention',
      improvement: -1.5,
    },
    {
      name: 'History',
      performance: 79,
      focus: 75,
      stress: 45,
      mindWandering: 25,
      status: 'good',
      improvement: 3.8,
    },
  ];

  const chartData = modules.map(m => ({
    name: m.name,
    performance: m.performance,
    focus: m.focus,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs-attention':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getBarColor = (value: number) => {
    if (value >= 85) return '#10b981';
    if (value >= 70) return '#3b82f6';
    return '#f59e0b';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Module Performance Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Module Performance Overview</CardTitle>
          <CardDescription>Comparative analysis across all subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
              <XAxis dataKey="name" className="text-slate-600" angle={-45} textAnchor="end" height={100} />
              <YAxis className="text-slate-600" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="performance" name="Performance" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.performance)} />
                ))}
              </Bar>
              <Bar dataKey="focus" fill="#6366f1" name="Focus" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            High Performers
          </CardTitle>
          <CardDescription>Modules with best outcomes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {modules
            .filter(m => m.status === 'excellent')
            .sort((a, b) => b.performance - a.performance)
            .map((module, index) => (
              <div key={module.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
                      {index + 1}
                    </div>
                    <span className="text-slate-700">{module.name}</span>
                  </div>
                  <span className="text-slate-900">{module.performance}%</span>
                </div>
                <Progress value={module.performance} className="h-2" />
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{module.improvement}%</span>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Detailed Module List */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Detailed Module Analysis</CardTitle>
          <CardDescription>In-depth cognitive metrics for each subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.name} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-slate-900">{module.name}</h3>
                    <Badge variant="outline" className={getStatusColor(module.status)}>
                      {module.status === 'excellent' && '⭐ Excellent'}
                      {module.status === 'good' && '✓ Good'}
                      {module.status === 'needs-attention' && <><AlertCircle className="w-3 h-3 mr-1 inline" />Needs Attention</>}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Overall:</span>
                    <span className="text-slate-900">{module.performance}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-600">Focus</span>
                      <span className="text-blue-600">{module.focus}%</span>
                    </div>
                    <Progress value={module.focus} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-600">Stress</span>
                      <span className="text-red-600">{module.stress}%</span>
                    </div>
                    <Progress value={module.stress} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-600">Mind-Wandering</span>
                      <span className="text-amber-600">{module.mindWandering}%</span>
                    </div>
                    <Progress value={module.mindWandering} className="h-1.5" />
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
