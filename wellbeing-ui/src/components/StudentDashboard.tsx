import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Brain, Activity, LogOut } from 'lucide-react';
import { LiveSession } from './student/LiveSession';
import { SessionAnalytics } from './student/SessionAnalytics';
import { FocusTrainer } from './student/FocusTrainer';
import { GuidedMeditation } from './student/GuidedMeditation';
import { AccessibilityGuide } from './student/AccessibilityGuide';

interface StudentDashboardProps {
  onLogout?: () => void;
}

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900">My Focus Dashboard</h1>
              <p className="text-slate-500">Track and improve your cognitive performance</p>
            </div>
          </div>
          {onLogout && (
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Change Role
            </Button>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="session" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl">
            <TabsTrigger value="session">Live Session</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="trainer">Focus Trainer</TabsTrigger>
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>

          <TabsContent value="session" className="space-y-4">
            <LiveSession />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <SessionAnalytics />
          </TabsContent>

          <TabsContent value="trainer" className="space-y-4">
            <FocusTrainer />
          </TabsContent>

          <TabsContent value="meditation" className="space-y-4">
            <GuidedMeditation />
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-4">
            <AccessibilityGuide />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
