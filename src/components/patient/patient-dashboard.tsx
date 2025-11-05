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
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white">
              Hola, {user?.firstName}
            </h1>
            <p className="text-lg text-white/90">
              ¿Necesitas atención médica? Estamos aquí para ayudarte.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="text-primary" /> Nueva Solicitud
            </CardTitle>
            <CardDescription>
              Crea una nueva solicitud de atención médica a domicilio de forma
              rápida y sencilla.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Button asChild className="w-full">
              <Link href="/requests/new">Crear Nueva Solicitud</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="text-primary" /> Mis Solicitudes
            </CardTitle>
            <CardDescription>
              Revisa el estado de tus solicitudes activas y tu historial de
              atenciones.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Button asChild variant="outline" className="w-full">
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
            <ul className="space-y-4">
              {recentRequests.map((req) => (
                <li
                  key={req.id}
                  className="flex items-center justify-between rounded-md border p-4"
                >
                  <div>
                    <p className="font-medium">{req.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {
                        formatDistanceToNow(new Date(req.requestDate), {
                          addSuffix: true,
                          locale: es,
                        })
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        statusColorMap[req.status] || 'text-gray-500'
                      }`}
                    >
                      {statusMap[req.status] || req.status}
                    </span>
                    <Link href={`/appointments/${req.id}`}>
                      <Button variant="ghost" size="icon">
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
