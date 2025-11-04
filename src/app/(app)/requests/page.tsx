'use client';

import { useAuth } from '@/hooks/use-auth-provider';
import { useAppointments } from '@/hooks/use-appointments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';

const statusMap: { [key: string]: string } = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  completed: 'Completada',
};

const statusColorMap: { [key: string]: string } = {
  pending: 'text-yellow-500',
  accepted: 'text-blue-500',
  completed: 'text-green-500',
};

export default function RequestsListPage() {
  const { user } = useAuth();
  const { data: allRequests, isLoading } = useAppointments('patient', user?.uid);

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Mis Solicitudes</CardTitle>
          <CardDescription>
            Aquí puedes ver el historial completo de tus solicitudes de atención.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : allRequests && allRequests.length > 0 ? (
            <ul className="space-y-4">
              {allRequests.map((req) => (
                <li
                  key={req.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4 hover:bg-secondary transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{req.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Solicitado {
                        formatDistanceToNow(new Date(req.requestDate), {
                          addSuffix: true,
                          locale: es,
                        })
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                     <span
                      className={`text-sm font-semibold ${
                        statusColorMap[req.status] || 'text-gray-500'
                      }`}>
                      {statusMap[req.status] || req.status}
                    </span>
                    <Link href={`/appointments/${req.id}`} passHref>
                      <Button variant="secondary">
                        Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No has realizado ninguna solicitud todavía.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
