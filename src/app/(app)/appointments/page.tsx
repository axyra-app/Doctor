'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AppointmentRequest } from "@/types";
import { MapPin, ArrowRight, User, Clock } from "lucide-react";
import React from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const mockRequests: (AppointmentRequest & {patient: {firstName: string, lastName: string, profilePictureURL: string}})[] = [
  { id: 'req1', patientId: 'p1', doctorId: null, requestDate: Date.now() - 300000, status: 'pending', description: 'Consulta pediátrica para niño con fiebre.', address: 'Calle Falsa 123, Colonia Centro', patient: {firstName: 'Ana', lastName: 'García', profilePictureURL: PlaceHolderImages.find(p => p.id === 'profile-1')?.imageUrl || ''} },
  { id: 'req2', patientId: 'p2', doctorId: null, requestDate: Date.now() - 1800000, status: 'pending', description: 'Control de presión arterial para adulto mayor.', address: 'Avenida Siempre Viva 742, Residencial Bosques', patient: {firstName: 'Carlos', lastName: 'Martínez', profilePictureURL: PlaceHolderImages.find(p => p.id === 'profile-2')?.imageUrl || ''} },
  { id: 'req3', patientId: 'p3', doctorId: null, requestDate: Date.now() - 3600000, status: 'pending', description: 'Revisión de herida y posible sutura.', address: 'Boulevard de los Sueños Rotos 45, Fracc. La Loma', patient: {firstName: 'Sofia', lastName: 'López', profilePictureURL: PlaceHolderImages.find(p => p.id === 'profile-3')?.imageUrl || ''} },
];

function RequestCard({ request }: { request: (AppointmentRequest & {patient: {firstName: string, lastName: string, profilePictureURL: string}}) }) {
  
  const getInitials = (firstName: string = '', lastName: string = '') => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={request.patient.profilePictureURL} alt={`${request.patient.firstName} ${request.patient.lastName}`} />
            <AvatarFallback>{getInitials(request.patient.firstName, request.patient.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{request.description}</CardTitle>
            <CardDescription className="flex items-center gap-1"><User className="h-3 w-3" /> Paciente: {request.patient.firstName} {request.patient.lastName}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="flex items-center text-sm"><MapPin className="h-4 w-4 mr-2 text-primary" /> {request.address}</p>
        <p className="flex items-center text-sm text-muted-foreground"><Clock className="h-4 w-4 mr-2" /> Solicitado hace {Math.round((Date.now() - request.requestDate) / 60000)} minutos</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          Aceptar Solicitud <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function NearbyRequestsPage() {

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Solicitudes Cercanas</h1>
        <p className="text-muted-foreground">Pacientes en tu área que necesitan atención médica.</p>
      </div>

      {mockRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRequests.map(req => <RequestCard key={req.id} request={req} />)}
        </div>
      ) : (
        <Card className="py-20">
          <CardContent className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">Todo tranquilo por aquí</h2>
              <p className="text-muted-foreground">No hay solicitudes pendientes en tu área en este momento. <br /> Te notificaremos cuando haya una nueva.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
