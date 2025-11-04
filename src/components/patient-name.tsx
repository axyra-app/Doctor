'use client';

import { useUser } from '@/hooks/use-user';
import { User } from 'lucide-react';

interface PatientNameProps {
  patientId: string;
}

export default function PatientName({ patientId }: PatientNameProps) {
  const { user, isLoading } = useUser(patientId);

  if (isLoading) {
    return <span className="text-sm text-muted-foreground">Cargando paciente...</span>;
  }

  return (
    <p className="font-medium flex items-center">
      <User className="mr-2 h-4 w-4 text-primary" />
      {user ? `${user.firstName} ${user.lastName}` : 'Paciente no encontrado'}
    </p>
  );
}
