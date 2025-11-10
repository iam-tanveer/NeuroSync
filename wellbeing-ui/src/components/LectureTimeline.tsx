import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Clock, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

export function LectureTimeline() {
  // Simulated lecture progression data showing topic changes
  const lectureData = [
    { time: '0:00', focus: 75, stress: 30, engagement: 78, topic: 'Introduction' },
    { time: '5:00', focus: 82, stress: 28, engagement: 85, topic: 'Introduction' },
    { time: '10:00', focus: 85, stress: 32, engagement: 88, topic: 'Introduction' },
    { time: '15:00', focus: 78, stress: 45, engagement: 80, topic: 'Complex Theory Start' },
    { time: '20:00', focus: 68, stress: 62, engagement: 65, topic: 'Complex Theory' },
    { time: '25:00', focus: 62, stress: 68, engagement: 58, topic: 'Complex Theory' },
    { time: '30:00', focus: 58, stress: 72, engagement: 55, topic: 'Complex Theory' },
    { time: '35:00', focus: 70, stress: 48, engagement: 72, topic: 'Break & Q&A' },
    { time: '40:00', focus: 78, stress: 38, engagement: 82, topic: 'Practical Example' },
    { time: '45:00', focus: 85, stress: 32, engagement: 90, topic: 'Practical Example' },
    { time: '50:00', focus: 82, stress: 35, engagement: 88, topic: 'Practical Example' },
    { time: '55:00', focus: 75, stress: 40, engagement: 78, topic: 'Summary' },
    { time: '60:00', focus: 72, stress: 42, engagement: 75, topic: 'Summary' },
  ];

  // Key moments during the lecture
  const keyMoments = [
    { time: 15, label: 'Topic Changed', type: 'warning' },
    { time: 35, label: 'Break', type: 'success' },
    { time: 40, label: 'Demo Started', type: 'success' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900">{payload[0].payload.time}</p>
          <p className="text-slate-700 mb-2">{payload[0].payload.topic}</p>
          <p className="text-blue-600">Focus: {payload[0].payload.focus}%</p>
          <p className="text-red-600">Stress: {payload[0].payload.stress}%</p>
          <p className="text-green-600">Engagement: {payload[0].payload.engagement}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Lecture Flow Chart */}
      <Card className="border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <CardTitle className="text-indigo-900">Lecture Flow Analysis</CardTitle>
              </div>
              <CardDescription>How class cognitive state changed during the lecture</CardDescription>
            </div>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">
              60 min session
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={lectureData}>
              <defs>
                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Reference lines for key moments */}
              <ReferenceLine x="15:00" stroke="#f59e0b" strokeDasharray="3 3" label="Topic Change" />
              <ReferenceLine x="35:00" stroke="#10b981" strokeDasharray="3 3" label="Break" />
              <ReferenceLine x="40:00" stroke="#10b981" strokeDasharray="3 3" label="Demo" />
              
              <Area 
                type="monotone" 
                dataKey="focus" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorFocus)" 
                name="Focus %"
              />
              <Area 
                type="monotone" 
                dataKey="stress" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorStress)" 
                name="Stress %"
              />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorEngagement)" 
                name="Engagement %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Insights from Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-1" />
              <div>
                <div className="text-amber-900 mb-1">Critical Drop at 20min</div>
                <div className="text-amber-700">Focus dropped 17% when complex theory started</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <div className="text-green-900 mb-1">Recovery After Break</div>
                <div className="text-green-700">Engagement surged 27% after break & demo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-red-600 mt-1" />
              <div>
                <div className="text-red-900 mb-1">Peak Stress Period</div>
                <div className="text-red-700">25-30min: 72% stress during theory</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topic Breakdown */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Topic-by-Topic Performance</CardTitle>
          <CardDescription>Average metrics for each lecture segment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-green-900">Introduction (0-15 min)</div>
                <Badge className="bg-green-600">Excellent</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-green-700">
                <div>Focus: 81%</div>
                <div>Stress: 30%</div>
                <div>Engagement: 84%</div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-red-900">Complex Theory (15-35 min)</div>
                <Badge variant="destructive">Needs Attention</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-red-700">
                <div>Focus: 67%</div>
                <div>Stress: 64%</div>
                <div>Engagement: 65%</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-900">Practical Example (40-55 min)</div>
                <Badge className="bg-blue-600">Great</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-blue-700">
                <div>Focus: 82%</div>
                <div>Stress: 35%</div>
                <div>Engagement: 87%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
