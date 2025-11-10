import { useState } from 'react';
import { RoleSelection } from './components/RoleSelection';
import { InstructorDashboardContent } from './components/InstructorDashboardContent';
import { StudentDashboard } from './components/StudentDashboard';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [role, setRole] = useState<'instructor' | 'student' | null>(null);

  const handleLogout = () => {
    setRole(null);
  };

  if (role === 'instructor') {
    return (
      <>
        <InstructorDashboardContent onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (role === 'student') {
    return (
      <>
        <StudentDashboard onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  return <RoleSelection onSelectRole={setRole} />;
}
