import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface CognitiveHeatmapProps {
  timeRange: string;
}

export function CognitiveHeatmap({ timeRange }: CognitiveHeatmapProps) {
  const hours = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Generate heatmap data (focus levels)
  const heatmapData = days.map((day) => 
    hours.map(() => Math.floor(Math.random() * 40) + 60)
  );

  const getColorIntensity = (value: number) => {
    if (value >= 85) return 'bg-green-600';
    if (value >= 75) return 'bg-green-500';
    if (value >= 65) return 'bg-blue-500';
    if (value >= 55) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const weeklyStats = [
    { metric: 'Peak Focus Time', value: '10AM - 12PM', color: 'text-green-600' },
    { metric: 'Lowest Stress Period', value: 'Saturday Morning', color: 'text-blue-600' },
    { metric: 'Best Performance Day', value: 'Friday', color: 'text-purple-600' },
    { metric: 'Attention Dips', value: '2PM - 3PM', color: 'text-amber-600' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Heatmap */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Weekly Focus Heatmap</CardTitle>
          <CardDescription>Visual representation of focus intensity throughout the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex gap-2 mb-4">
              <div className="w-24"></div>
              {hours.map((hour) => (
                <div key={hour} className="flex-1 text-center text-slate-600">
                  {hour}
                </div>
              ))}
            </div>
            {days.map((day, dayIndex) => (
              <div key={day} className="flex gap-2 items-center">
                <div className="w-24 text-slate-700">{day}</div>
                {heatmapData[dayIndex].map((value, hourIndex) => (
                  <div
                    key={hourIndex}
                    className={`flex-1 h-12 ${getColorIntensity(value)} rounded flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer group relative`}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {value}%
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-slate-200">
            <span className="text-slate-600">Focus Level:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-slate-600">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-slate-600">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-slate-600">Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-slate-600">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-slate-600">Excellent</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Pattern analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyStats.map((stat) => (
            <div key={stat.metric} className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-600 mb-1">{stat.metric}</p>
              <p className={`${stat.color}`}>{stat.value}</p>
            </div>
          ))}
          
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-slate-700 mb-3">Recommendations</h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <span>Schedule demanding tasks during peak focus hours</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <span>Take breaks during afternoon attention dips</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <span>Maintain Saturday morning study routine</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
