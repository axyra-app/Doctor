'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth-provider';
import { useAppointments } from '@/hooks/use-appointments';
import { ArrowRight, List, Loader2, Send } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { Badge } from '@/components/ui/badge';

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

export function PatientDashboard() {
  const { user } = useAuth();
  const { data: recentRequests, isLoading } = useAppointments(
    'patient',
    user?.uid || undefined
  );
  const heroImage = PlaceHolderImages.find((img) => img.id === 'patient-banner');

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <div className="relative h-48 w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Hola, {user?.firstName}
            </h1>
            <p className="text-base sm:text-lg text-white/90 mt-1">
              ¿Necesitas atención médica? Estamos aquí para ayudarte.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Send className="h-5 w-5 text-primary flex-shrink-0" /> 
              <span className="truncate">Nueva Solicitud</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Crea una nueva solicitud de atención médica a domicilio de forma
              rápida y sencilla.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end pt-0">
            <Button asChild className="w-full" size="sm">
              <Link href="/requests/new">Crear Nueva Solicitud</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <List className="h-5 w-5 text-primary flex-shrink-0" /> 
              <span className="truncate">Mis Solicitudes</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Revisa el estado de tus solicitudes activas y tu historial de
              atenciones.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end pt-0">
            <Button asChild variant="outline" className="w-full" size="sm">
              <Link href="/requests">Ver Mis Solicitudes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : recentRequests && recentRequests.length > 0 ? (
            <ul className="space-y-3 sm:space-y-4">
              {recentRequests.map((req) => (
                <li
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-md border p-3 sm:p-4 hover:bg-card/80 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base line-clamp-2 mb-1">{req.description}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {
                        formatDistanceToNow(new Date(req.requestDate), {
                          addSuffix: true,
                          locale: es,
                        })
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        req.status === 'completed' ? 'border-green-500 text-green-700 dark:text-green-400' :
                        req.status === 'accepted' ? 'border-blue-500 text-blue-700 dark:text-blue-400' :
                        'border-yellow-500 text-yellow-700 dark:text-yellow-400'
                      }`}
                    >
                      {statusMap[req.status] || req.status}
                    </Badge>
                    <Link href={`/appointments/${req.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No has realizado ninguna solicitud todavía.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
