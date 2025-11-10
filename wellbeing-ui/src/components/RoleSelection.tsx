import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Brain, Users, User } from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: 'instructor' | 'student') => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-slate-900">Cognitive Workload Monitor</h1>
            <p className="text-slate-600">Select your role to continue</p>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instructor Card */}
          <Card 
            className="border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer hover:shadow-xl group"
            onClick={() => onSelectRole('instructor')}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-blue-900">Instructor Dashboard</CardTitle>
              <CardDescription>Monitor and analyze student performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Real-time class monitoring</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Lecture timeline analysis</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Teaching strategy recommendations</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Anonymous aggregated insights</span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                Continue as Instructor
              </Button>
            </CardContent>
          </Card>

          {/* Student Card */}
          <Card 
            className="border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer hover:shadow-xl group"
            onClick={() => onSelectRole('student')}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-purple-900">Student Dashboard</CardTitle>
              <CardDescription>Track and improve your focus</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>Personal focus tracking</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>Audio feedback & tips</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>Focus training exercises</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>Guided meditation sessions</span>
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                Continue as Student
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500">
          <p>Privacy-first cognitive monitoring with MUSE 2</p>
        </div>
      </div>
    </div>
  );
}
