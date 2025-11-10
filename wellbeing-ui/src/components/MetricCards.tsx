import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, Focus, Activity, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardsProps {
  timeRange: string;
}

export function MetricCards({ timeRange }: MetricCardsProps) {
  const metrics = [
    {
      title: 'Focus Level',
      value: 78,
      change: 5.2,
      trend: 'up',
      icon: Focus,
      color: 'from-blue-500 to-blue-600',
      description: 'Average attention span',
    },
    {
      title: 'Stress Index',
      value: 42,
      change: -3.1,
      trend: 'down',
      icon: Activity,
      color: 'from-red-500 to-red-600',
      description: 'Cognitive load pressure',
    },
    {
      title: 'Mind-Wandering',
      value: 23,
      change: -2.8,
      trend: 'down',
      icon: Brain,
      color: 'from-amber-500 to-amber-600',
      description: 'Off-task thoughts',
    },
    {
      title: 'Performance',
      value: 85,
      change: 7.4,
      trend: 'up',
      icon: Sparkles,
      color: 'from-green-500 to-green-600',
      description: 'Overall cognitive output',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isPositive = metric.trend === 'up' ? metric.title !== 'Stress Index' && metric.title !== 'Mind-Wandering' : metric.title === 'Stress Index' || metric.title === 'Mind-Wandering';
        
        return (
          <Card key={metric.title} className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-5 rounded-full -mr-16 -mt-16`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-slate-600">{metric.title}</CardTitle>
              <div className={`p-2 bg-gradient-to-br ${metric.color} rounded-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-end gap-2">
                  <span className="text-slate-900">{metric.value}%</span>
                  <Badge variant={isPositive ? 'default' : 'secondary'} className="mb-1">
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(metric.change)}%
                  </Badge>
                </div>
                <p className="text-slate-500">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
