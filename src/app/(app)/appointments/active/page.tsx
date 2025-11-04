'use client';

import { useAuth } from '@/hooks/use-auth-provider';
import { useAppointments } from '@/hooks/use-appointments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PatientName from '@/components/patient-name'; // Importar el nuevo componente

export default function ActiveAppointmentsPage() {
  const { user } = useAuth();
  const { data: activeAppointments, isLoading } = useAppointments(
    'doctor',
    user?.uid,
    'accepted'
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Citas Activas</CardTitle>
          <CardDescription>
            Estas son las citas que has aceptado y están pendientes de completar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : activeAppointments && activeAppointments.length > 0 ? (
            <ul className="space-y-4">
              {activeAppointments.map((req) => (
                <li
                  key={req.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4 hover:bg-secondary transition-colors"
                >
                  <div className="space-y-1">
                    {/* Usar el nuevo componente PatientName */}
                    <PatientName patientId={req.patientId} /> 
                    <p className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      {req.address}
                    </p>
                  </div>
                  <Link href={`/appointments/${req.id}`} passHref>
                    <Button variant="secondary">
                      Gestionar Cita <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No tienes ninguna cita activa en este momento.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
