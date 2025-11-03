'use client';

import { useAuth } from '@/hooks/use-auth-provider';
import { PatientDashboard } from '@/components/patient/patient-dashboard';
import { DoctorDashboard } from '@/components/doctor/doctor-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <DashboardSkeleton />;
  }

  return user.role === 'patient' ? <PatientDashboard /> : <DoctorDashboard />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-48 w-full" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
