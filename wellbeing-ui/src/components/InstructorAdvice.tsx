import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface InstructorAdviceProps {
  timeRange: string;
}

export function InstructorAdvice({ timeRange }: InstructorAdviceProps) {
  // Simulated data analysis
  const insights = {
    criticalAlert: {
      title: '80% stressed during Module 5',
      severity: 'high',
      recommendation: 'Break content into smaller chunks'
    },
    improvements: [
      { action: 'Add visual aids', impact: 'Reduce stress 15%' },
      { action: 'Interactive demos', impact: 'Boost focus 20%' },
      { action: 'Morning complex topics', impact: 'Peak engagement' }
    ],
    working: [
      'Coding exercises maintain focus',
      'Review sessions low stress'
    ],
    timeOptimization: '9:30-11:00 AM best for difficult material'
  };

  return (
    <div className="space-y-4">
      {/* Critical Alert */}
      <Alert className="border-amber-500 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-900">
          <strong className="font-semibold">Action Required:</strong> {insights.criticalAlert.title} — {insights.criticalAlert.recommendation}
        </AlertDescription>
      </Alert>

      {/* Main Advice Card */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-blue-900">Teaching Strategy Recommendations</CardTitle>
          </div>
          <CardDescription>Data-driven insights to improve student outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quick Wins */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <h3 className="text-green-900">Quick Wins</h3>
              </div>
              <div className="space-y-2">
                {insights.improvements.map((item, index) => (
                  <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-green-900">{item.action}</div>
                    <div className="text-green-600">{item.impact}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keep Doing */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <h3 className="text-blue-900">Keep Doing</h3>
              </div>
              <div className="space-y-2">
                {insights.working.map((item, index) => (
                  <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2 text-blue-900">
                      <span className="text-blue-600">✓</span>
                      <span>{item}</span>
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-blue-900">Students engaged mornings</div>
                  <div className="text-blue-600">Continue this timing</div>
                </div>
              </div>
            </div>

            {/* Schedule Optimization */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-purple-600" />
                <h3 className="text-purple-900">Timing Insights</h3>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="text-purple-900">Peak Focus Window</div>
                  <div className="text-purple-600">{insights.timeOptimization}</div>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="text-purple-900">Post-lunch dip</div>
                  <div className="text-purple-600">2-3 PM needs breaks</div>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="text-purple-900">Attention span avg</div>
                  <div className="text-purple-600">8.5 min segments ideal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Items */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h4 className="text-slate-900 mb-3">Top 3 Actions This Week:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-white">1</Badge>
                <span className="text-slate-700">Schedule complex topics between 9:30-11:00 AM</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-white">2</Badge>
                <span className="text-slate-700">Add visual diagrams to Module 5 (Quantum Mechanics)</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-white">3</Badge>
                <span className="text-slate-700">Increase afternoon break frequency to every 8 minutes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
