import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Calendar, Clock, TrendingUp, Award, Brain, Zap } from 'lucide-react';

export function SessionAnalytics() {
  // Past sessions data
  const sessionsData = [
    { date: 'Nov 4', duration: 45, avgFocus: 82, avgStress: 28, completed: true },
    { date: 'Nov 5', duration: 60, avgFocus: 78, avgStress: 35, completed: true },
    { date: 'Nov 6', duration: 30, avgFocus: 65, avgStress: 52, completed: false },
    { date: 'Nov 7', duration: 50, avgFocus: 88, avgStress: 22, completed: true },
    { date: 'Nov 8', duration: 55, avgFocus: 85, avgStress: 25, completed: true },
    { date: 'Nov 9', duration: 40, avgFocus: 72, avgStress: 42, completed: true },
    { date: 'Nov 10', duration: 65, avgFocus: 90, avgStress: 20, completed: true },
  ];

  // Time of day performance
  const timeOfDayData = [
    { time: '6-8 AM', focus: 65, energy: 70 },
    { time: '8-10 AM', focus: 88, energy: 85 },
    { time: '10-12 PM', focus: 92, energy: 88 },
    { time: '12-2 PM', focus: 62, energy: 55 },
    { time: '2-4 PM', focus: 58, energy: 52 },
    { time: '4-6 PM', focus: 75, energy: 72 },
    { time: '6-8 PM', focus: 82, energy: 80 },
    { time: '8-10 PM', focus: 70, energy: 65 },
  ];

  // Focus exercise effectiveness
  const exerciseEffectiveness = [
    { exercise: 'Breathing', beforeFocus: 55, afterFocus: 78 },
    { exercise: 'Meditation', beforeFocus: 60, afterFocus: 85 },
    { exercise: 'Break', beforeFocus: 52, afterFocus: 72 },
    { exercise: 'Stretch', beforeFocus: 58, afterFocus: 75 },
  ];

  // Weekly performance radar
  const weeklyPerformance = [
    { subject: 'Focus', value: 85 },
    { subject: 'Consistency', value: 72 },
    { subject: 'Duration', value: 78 },
    { subject: 'Stress Mgmt', value: 68 },
    { subject: 'Peak Hours', value: 90 },
  ];

  const totalStudyTime = sessionsData.reduce((acc, session) => acc + session.duration, 0);
  const avgFocusScore = Math.floor(sessionsData.reduce((acc, session) => acc + session.avgFocus, 0) / sessionsData.length);
  const completedSessions = sessionsData.filter(s => s.completed).length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-slate-500">Total Study Time</div>
                <div className="text-purple-900">{totalStudyTime} mins</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-slate-500">Avg Focus</div>
                <div className="text-blue-900">{avgFocusScore}%</div>
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
                <div className="text-slate-500">Completed</div>
                <div className="text-green-900">{completedSessions} sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-slate-500">Best Time</div>
                <div className="text-amber-900">10-12 PM</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session History */}
      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900">Focus & Stress Over Time</CardTitle>
          <CardDescription>Your cognitive performance trend</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sessionsData}>
              <defs>
                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="avgFocus" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorFocus)" 
                name="Average Focus %"
              />
              <Area 
                type="monotone" 
                dataKey="avgStress" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorStress)" 
                name="Average Stress %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Time of Day Analysis */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">Best Time of Day</CardTitle>
            <CardDescription>When are you most focused?</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeOfDayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" angle={-15} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="focus" fill="#8b5cf6" name="Focus Score" />
                <Bar dataKey="energy" fill="#06b6d4" name="Energy Level" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Exercise Effectiveness */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Exercise Impact</CardTitle>
            <CardDescription>Focus improvement after exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={exerciseEffectiveness}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="exercise" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="beforeFocus" fill="#f59e0b" name="Before" />
                <Bar dataKey="afterFocus" fill="#10b981" name="After" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Performance Radar */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Weekly Performance Overview</CardTitle>
          <CardDescription>Your cognitive performance across dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={weeklyPerformance}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Performance" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <div className="text-green-900 mb-1">Peak Performance</div>
                <div className="text-green-700">You're most focused 10 AM - 12 PM. Schedule difficult tasks then.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <div className="text-blue-900 mb-1">Exercise Works!</div>
                <div className="text-blue-700">Meditation boosts focus by 25%. Keep it up!</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-amber-600 mt-1" />
              <div>
                <div className="text-amber-900 mb-1">Consistency Tip</div>
                <div className="text-amber-700">Aim for 50+ min sessions. You complete 85% of them.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
