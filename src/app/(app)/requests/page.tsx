'use client';

import { useAuth } from '@/hooks/use-auth-provider';
import { useAppointments } from '@/hooks/use-appointments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight, MapPin, Stethoscope, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';

const statusMap: { [key: string]: string } = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  'en-route': 'En Camino',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  accepted: 'bg-blue-100 text-blue-800 border-blue-200',
  'en-route': 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
};

const urgencyColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  emergency: 'bg-red-100 text-red-800 border-red-200',
};

const urgencyLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  emergency: 'Emergencia',
};

export default function RequestsListPage() {
  const { user } = useAuth();
  const { data: allRequests, isLoading } = useAppointments('patient', user?.uid);

  // Ordenar solicitudes por fecha (más recientes primero)
  const sortedRequests = allRequests?.sort((a, b) => b.requestDate - a.requestDate) || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mis Solicitudes</h1>
        <p className="text-muted-foreground mt-2">
          Aquí puedes ver el historial completo de tus solicitudes de atención médica.
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : sortedRequests.length > 0 ? (
        <div className="space-y-4">
          {sortedRequests.map((req) => (
            <Card key={req.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-semibold text-lg line-clamp-2">{req.description}</h3>
                          <div className="flex flex-col gap-2 items-end flex-shrink-0">
                            {req.urgency && (
                              <Badge className={`${urgencyColors[req.urgency]} text-xs`}>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {urgencyLabels[req.urgency]}
                              </Badge>
                            )}
                            <Badge className={`${statusColors[req.status]} text-xs`}>
                              {statusMap[req.status] || req.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          {req.specialty && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Stethoscope className="h-4 w-4" />
                              <span>{req.specialty}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{req.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              Solicitado {formatDistanceToNow(new Date(req.requestDate), {
                                addSuffix: true,
                                locale: es,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 md:flex-col md:items-end">
                    <Link href={`/appointments/${req.id}`}>
                      <Button variant="secondary" className="w-full md:w-auto">
                        Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No has realizado ninguna solicitud todavía.
            </p>
            <Link href="/requests/new">
              <Button>Crear Nueva Solicitud</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
