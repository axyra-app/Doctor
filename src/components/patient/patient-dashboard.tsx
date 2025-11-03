'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth-provider';
import { ArrowRight, List, Send } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function PatientDashboard() {
  const { user } = useAuth();
  const heroImage = PlaceHolderImages.find(img => img.id === 'patient-banner');

  const recentRequests = [
    { id: '1', description: 'Fiebre y dolor de garganta', status: 'pending', date: 'Hace 2 horas' },
    { id: '2', description: 'Revisión de tobillo torcido', status: 'completed', date: 'Ayer' },
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
                <h1 className="text-3xl font-bold text-white">Hola, {user?.firstName}</h1>
                <p className="text-lg text-white/90">¿Necesitas atención médica? Estamos aquí para ayudarte.</p>
            </div>
        </div>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Send className="text-primary"/> Nueva Solicitud</CardTitle>
                <CardDescription>Crea una nueva solicitud de atención médica a domicilio de forma rápida y sencilla.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
                <Button asChild className="w-full">
                    <Link href="/requests/new">Crear Nueva Solicitud</Link>
                </Button>
            </CardContent>
        </Card>
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><List className="text-primary"/> Mis Solicitudes</CardTitle>
                <CardDescription>Revisa el estado de tus solicitudes activas y tu historial de atenciones.</CardDescription>
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
          <ul className="space-y-4">
            {recentRequests.map((req) => (
              <li key={req.id} className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium">{req.description}</p>
                  <p className="text-sm text-muted-foreground">{req.date}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${req.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                        {req.status === 'pending' ? 'Pendiente' : 'Completada'}
                    </span>
                    <Link href={`/requests/${req.id}`} passHref>
                        <Button variant="ghost" size="icon">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
