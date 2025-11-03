'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { HeartPulse, Stethoscope, ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function DoctorDashboard() {
  const { user } = useAuth();
  const heroImage = PlaceHolderImages.find(img => img.id === 'doctor-banner');
  
  const nearbyRequests = [
    { id: 'req1', description: 'Consulta pediátrica', distance: '2 km', address: 'Calle Falsa 123' },
    { id: 'req2', description: 'Control de presión arterial', distance: '5 km', address: 'Avenida Siempre Viva 742' },
  ];

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <div className="relative h-48 w-full">
          {heroImage && 
            <Image 
                src={heroImage.imageUrl} 
                alt={heroImage.description} 
                fill 
                className="object-cover" 
                data-ai-hint={heroImage.imageHint}
            />
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white">Bienvenido, Dr. {user?.lastName}</h1>
            <p className="text-lg text-white/90">Hay pacientes que necesitan tu ayuda.</p>
          </div>
        </div>
      </Card>
      
       <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><HeartPulse className="text-primary"/> Solicitudes Cercanas</CardTitle>
                <CardDescription>Visualiza y acepta nuevas solicitudes de pacientes en tu área.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
                <Button asChild className="w-full">
                    <Link href="/appointments">Ver Solicitudes</Link>
                </Button>
            </CardContent>
        </Card>
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Stethoscope className="text-primary"/> Mis Atenciones</CardTitle>
                <CardDescription>Revisa tu historial de atenciones y gestiona tus citas activas.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
                <Button asChild variant="outline" className="w-full">
                    <Link href="/appointments/history">Ver Mis Atenciones</Link>
                </Button>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes Cercanas</CardTitle>
        </CardHeader>
        <CardContent>
          {nearbyRequests.length > 0 ? (
            <ul className="space-y-4">
              {nearbyRequests.map((req) => (
                <li key={req.id} className="flex items-center justify-between rounded-md border p-4 hover:bg-card/80 transition-colors">
                  <div>
                    <p className="font-medium">{req.description}</p>
                    <p className="flex items-center text-sm text-muted-foreground"><MapPin className="mr-1 h-3 w-3" />{req.address} ({req.distance})</p>
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
            <p className="text-center text-muted-foreground py-8">No hay solicitudes pendientes en tu área.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
