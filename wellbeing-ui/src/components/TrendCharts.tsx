import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendChartsProps {
  timeRange: string;
}

export function TrendCharts({ timeRange }: TrendChartsProps) {
  const weeklyData = [
    { day: 'Mon', focus: 72, stress: 45, mindWandering: 28, performance: 78 },
    { day: 'Tue', focus: 75, stress: 48, mindWandering: 25, performance: 82 },
    { day: 'Wed', focus: 78, stress: 42, mindWandering: 22, performance: 85 },
    { day: 'Thu', focus: 76, stress: 40, mindWandering: 24, performance: 83 },
    { day: 'Fri', focus: 80, stress: 38, mindWandering: 20, performance: 87 },
    { day: 'Sat', focus: 82, stress: 35, mindWandering: 18, performance: 90 },
    { day: 'Sun', focus: 78, stress: 42, mindWandering: 23, performance: 85 },
  ];

  const dailyData = [
    { time: '8AM', focus: 65, stress: 35, mindWandering: 30, performance: 70 },
    { time: '10AM', focus: 78, stress: 42, mindWandering: 22, performance: 82 },
    { time: '12PM', focus: 72, stress: 48, mindWandering: 28, performance: 75 },
    { time: '2PM', focus: 68, stress: 52, mindWandering: 32, performance: 72 },
    { time: '4PM', focus: 75, stress: 45, mindWandering: 25, performance: 80 },
    { time: '6PM', focus: 80, stress: 38, mindWandering: 20, performance: 85 },
  ];

  const data = timeRange === 'day' ? dailyData : weeklyData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Focus & Stress Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Focus & Stress Levels</CardTitle>
          <CardDescription>Track attention and cognitive pressure over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
              <XAxis dataKey={timeRange === 'day' ? 'time' : 'day'} className="text-slate-600" />
              <YAxis className="text-slate-600" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="focus" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                name="Focus"
              />
              <Area 
                type="monotone" 
                dataKey="stress" 
                stackId="2"
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.6}
                name="Stress"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Cognitive Performance</CardTitle>
          <CardDescription>Overall mental efficiency and output quality</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
              <XAxis dataKey={timeRange === 'day' ? 'time' : 'day'} className="text-slate-600" />
              <YAxis className="text-slate-600" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                name="Performance"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mind-Wandering Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Mind-Wandering Index</CardTitle>
          <CardDescription>Frequency of off-task mental activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
              <XAxis dataKey={timeRange === 'day' ? 'time' : 'day'} className="text-slate-600" />
              <YAxis className="text-slate-600" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="mindWandering" 
                fill="#f59e0b" 
                radius={[8, 8, 0, 0]}
                name="Mind-Wandering %"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Combined Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Metric Comparison</CardTitle>
          <CardDescription>All cognitive indicators at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
              <XAxis dataKey={timeRange === 'day' ? 'time' : 'day'} className="text-slate-600" />
              <YAxis className="text-slate-600" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="focus" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Focus"
              />
              <Line 
                type="monotone" 
                dataKey="stress" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Stress"
              />
              <Line 
                type="monotone" 
                dataKey="mindWandering" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Mind-Wandering"
              />
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Performance"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
