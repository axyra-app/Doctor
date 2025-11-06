'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppointments } from '@/hooks/use-appointments';
import { useAuth } from '@/hooks/use-auth-provider';
import { useDocument } from '@/firebase/firestore/use-document';
import { UserProfile } from '@/types';
import { ArrowRight, Clock, MapPin, User, Stethoscope, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { RequestsMap } from '@/components/maps/requests-map';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/page-header';

function RequestCard({ request }: { request: any }) {
  const { data: patient } = useDocument<UserProfile>(request.patientId ? `users/${request.patientId}` : null);
  
  const getInitials = (firstName: string = '', lastName: string = '') => {
    return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
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

  return (
    <Card className='hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-3 sm:gap-4'>
          <div className='flex items-start gap-3 sm:gap-4 flex-1 min-w-0'>
            <Avatar className='h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0'>
              <AvatarImage
                src={patient?.profilePictureURL || ''}
                alt={`${patient?.firstName || ''} ${patient?.lastName || ''}`}
              />
              <AvatarFallback className="text-xs sm:text-sm">
                {getInitials(patient?.firstName || '', patient?.lastName || '')}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <CardTitle className='text-base sm:text-lg line-clamp-2 mb-1'>{request.description}</CardTitle>
              <CardDescription className='flex items-center gap-1.5 text-xs sm:text-sm'>
                <User className='h-3 w-3 flex-shrink-0' /> 
                <span className="truncate">{patient?.firstName || 'Paciente'} {patient?.lastName || ''}</span>
              </CardDescription>
            </div>
          </div>
          {request.urgency && (
            <Badge className={`${urgencyColors[request.urgency]} text-xs flex-shrink-0`}>
              <AlertCircle className='h-3 w-3 mr-1' />
              <span className="hidden sm:inline">{urgencyLabels[request.urgency]}</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-2.5 sm:space-y-3 pt-0'>
        {request.specialty && (
          <div className='flex items-center gap-2 text-xs sm:text-sm'>
            <Stethoscope className='h-4 w-4 text-primary flex-shrink-0' />
            <span className='font-medium truncate'>{request.specialty}</span>
          </div>
        )}
        <p className='flex items-start gap-2 text-xs sm:text-sm'>
          <MapPin className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
          <span className='line-clamp-2 break-words'>{request.address}</span>
        </p>
        <p className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'>
          <Clock className='h-4 w-4 flex-shrink-0' />
          Hace {formatDistanceToNow(new Date(request.requestDate), { addSuffix: true, locale: es })}
        </p>
      </CardContent>
      <CardFooter className='pt-3'>
        <Button asChild className='w-full' size="sm" variant="default">
          <Link href={`/appointments/${request.id}`}>
            Ver Detalles <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function NearbyRequestsPage() {
  const { user } = useAuth();
  const { data: requests, isLoading } = useAppointments('doctor', undefined, 'pending');
  const { lat, lng } = useGeolocation();
  const currentLocation = lat && lng ? { lat, lng } : undefined;

  return (
    <div className='space-y-6'>
      <PageHeader
        title="Solicitudes Cercanas"
        description="Pacientes en tu área que necesitan atención médica. Acepta las solicitudes que puedas atender."
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : requests && requests.length > 0 ? (
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Vista de Lista</TabsTrigger>
            <TabsTrigger value="map">Vista de Mapa</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                {requests.map((req) => (
                  <RequestCard key={req.id} request={req} />
                ))}
              </div>
            </TabsContent>
          <TabsContent value="map" className="mt-6">
            <RequestsMap
              requests={requests}
              currentLocation={currentLocation}
              onRequestClick={(request) => {
                window.location.href = `/appointments/${request.id}`;
              }}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <Card className='py-20'>
          <CardContent className='text-center space-y-4'>
            <h2 className='text-2xl font-semibold'>Todo tranquilo por aquí</h2>
            <p className='text-muted-foreground'>
              No hay solicitudes pendientes en tu área en este momento. <br /> 
              Te notificaremos cuando haya una nueva solicitud.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
