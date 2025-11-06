'use client';

import { useAuth } from '@/hooks/use-auth-provider';
import { useAppointments } from '@/hooks/use-appointments';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowRight, MapPin, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PatientName from '@/components/patient-name';
import { PageHeader } from '@/components/page-header';

export default function AppointmentsHistoryPage() {
  const { user } = useAuth();
  const { data: completedAppointments, isLoading } = useAppointments(
    'doctor',
    user?.uid,
    'completed'
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Historial de Atenciones"
        description="Aquí puedes ver todas las citas que has completado."
      />
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : completedAppointments && completedAppointments.length > 0 ? (
            <ul className="space-y-3 sm:space-y-4">
              {completedAppointments.map((req) => (
                <li
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-md border p-3 sm:p-4 bg-card hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex-1 space-y-2 min-w-0">
                    <PatientName patientId={req.patientId} />
                    <p className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2 break-words">{req.address}</span>
                    </p>
                    <p className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <CalendarCheck className="h-4 w-4 text-primary flex-shrink-0" />
                      Completada el {new Date(req.requestDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <Link href={`/appointments/${req.id}`} className="w-full sm:w-auto">
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                      Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No has completado ninguna cita todavía.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
