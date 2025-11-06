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
import {
  ArrowRight,
  HeartPulse,
  Stethoscope,
  MapPin,
  Loader2,
  ClipboardCheck,
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AvailabilityToggle } from './availability-toggle';

export function DoctorDashboard() {
  const { user } = useAuth();
  // Fetch pending requests for all doctors (nearby requests)
  const { data: nearbyRequests, isLoading: isLoadingNearby } = useAppointments(
    'doctor',
    undefined,
    'pending'
  );
  // Fetch accepted appointments for the current doctor (only if user is available)
  const { data: acceptedAppointments, isLoading: isLoadingAccepted } = useAppointments(
    'doctor',
    user?.uid || undefined,
    'accepted'
  );

  const heroImage = PlaceHolderImages.find((img) => img.id === 'doctor-banner');

  const acceptedCount = acceptedAppointments?.length || 0;

  return (
    <div className="space-y-8">
      {/* Availability Toggle */}
      <AvailabilityToggle />

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
              Bienvenido, Dr. {user?.lastName}
            </h1>
            <p className="text-base sm:text-lg text-white/90 mt-1">
              Hay {nearbyRequests?.length || 0} paciente{nearbyRequests?.length !== 1 ? 's' : ''} que necesita{nearbyRequests?.length === 1 ? '' : 'n'} tu ayuda.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <HeartPulse className="h-5 w-5 text-primary flex-shrink-0" /> 
              <span className="truncate">Solicitudes Cercanas</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Visualiza y acepta nuevas solicitudes de pacientes en tu área.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end pt-0">
            <Button asChild className="w-full" size="sm">
              <Link href="/appointments">Ver Solicitudes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <ClipboardCheck className="h-5 w-5 text-primary flex-shrink-0" /> 
              <span className="truncate">Citas Aceptadas</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Tienes {acceptedCount} {acceptedCount === 1 ? 'cita aceptada' : 'citas aceptadas'} pendiente{acceptedCount === 1 ? '' : 's'} de completar.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end pt-0">
            <Button asChild className="w-full" variant='secondary' size="sm">
              <Link href="/appointments/active">Ver Citas Activas</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Stethoscope className="h-5 w-5 text-primary flex-shrink-0" /> 
              <span className="truncate">Mis Atenciones</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Revisa tu historial de atenciones completadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end pt-0">
            <Button asChild variant="outline" className="w-full" size="sm">
              <Link href="/appointments/history">Ver Historial</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes Cercanas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingNearby ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : nearbyRequests && nearbyRequests.length > 0 ? (
            <ul className="space-y-3 sm:space-y-4">
              {nearbyRequests.map((req) => (
                <li
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-md border p-3 sm:p-4 hover:bg-card/80 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base line-clamp-2 mb-1">{req.description}</p>
                    <p className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="mr-1.5 h-3 w-3 flex-shrink-0" />
                      <span className="line-clamp-1 break-words">{req.address}</span>
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
              No hay solicitudes pendientes en tu área.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
