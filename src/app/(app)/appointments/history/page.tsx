'use client';

import { useAuth } from '@/hooks/use-auth-provider';
import { useAppointments } from '@/hooks/use-appointments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight, MapPin, User, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AppointmentsHistoryPage() {
  const { user } = useAuth();
  const { data: completedAppointments, isLoading } = useAppointments(
    'doctor',
    user?.uid,
    'completed'
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Historial de Atenciones</CardTitle>
          <CardDescription>
            Aquí puedes ver todas las citas que has completado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : completedAppointments && completedAppointments.length > 0 ? (
            <ul className="space-y-4">
              {completedAppointments.map((req) => (
                <li
                  key={req.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4 bg-card hover:bg-secondary/80 transition-colors"
                >
                  <div className="space-y-2">
                    <p className="font-medium flex items-center">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      {req.patientName}
                    </p>
                    <p className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      {req.address}
                    </p>
                     <p className="flex items-center text-sm text-muted-foreground">
                      <CalendarCheck className="mr-2 h-4 w-4 text-primary" />
                      Completada el {new Date(req.requestDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <Link href={`/appointments/${req.id}`} passHref>
                    <Button variant="secondary">
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
