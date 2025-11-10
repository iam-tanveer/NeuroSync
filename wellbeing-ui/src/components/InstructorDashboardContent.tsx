import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { InstructorAdvice } from './InstructorAdvice';
import { RealTimeMonitor } from './RealTimeMonitor';
import { LectureTimeline } from './LectureTimeline';
import { MetricCards } from './MetricCards';
import { TrendCharts } from './TrendCharts';
import { ModulePerformance } from './ModulePerformance';
import { CognitiveHeatmap } from './CognitiveHeatmap';
import { Brain, LogOut } from 'lucide-react';

interface InstructorDashboardContentProps {
  onLogout?: () => void;
}

export function InstructorDashboardContent({ onLogout }: InstructorDashboardContentProps) {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900">Cognitive Workload Dashboard</h1>
              <p className="text-slate-500">Monitor and analyze student mental performance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            {onLogout && (
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Change Role
              </Button>
            )}
          </div>
        </div>

        {/* Instructor Advice - AT THE TOP */}
        <InstructorAdvice timeRange={timeRange} />

        {/* Metric Overview Cards */}
        <MetricCards timeRange={timeRange} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="realtime" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl">
            <TabsTrigger value="realtime">Real-Time</TabsTrigger>
            <TabsTrigger value="lecture">Lecture</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-4">
            <RealTimeMonitor />
          </TabsContent>

          <TabsContent value="lecture" className="space-y-4">
            <LectureTimeline />
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <TrendCharts timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="modules">
            <ModulePerformance />
          </TabsContent>

          <TabsContent value="heatmap">
            <CognitiveHeatmap timeRange={timeRange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
