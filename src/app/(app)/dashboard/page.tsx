'use client';

import { useAuth } from '@/hooks/use-auth-provider';
import { DoctorDashboard } from '@/components/doctor/doctor-dashboard';
import { PatientDashboard } from '@/components/patient/patient-dashboard';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Or a message indicating no user is logged in
  }

  return (
    <>
      {user.role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />}
    </>
  );
}
