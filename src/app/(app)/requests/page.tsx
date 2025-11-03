'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AppointmentRequest, RequestStatus } from "@/types";
import { Clock, CheckCircle, Truck, XCircle, MoreHorizontal } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

const mockRequests: AppointmentRequest[] = [
  { id: '1', patientId: 'p1', doctorId: 'd1', requestDate: Date.now() - 3600000, status: 'accepted', description: 'Fiebre alta y dolor de cabeza', address: 'Calle Falsa 123' },
  { id: '2', patientId: 'p1', doctorId: 'd2', requestDate: Date.now() - 86400000, status: 'completed', description: 'Revisión de tobillo', address: 'Av. Siempre Viva 742' },
  { id: '3', patientId: 'p1', doctorId: null, requestDate: Date.now() - 172800000, status: 'pending', description: 'Dolor de estómago persistente', address: 'Plaza Mayor 1' },
  { id: '4', patientId: 'p1', doctorId: 'd1', requestDate: Date.now() - 259200000, status: 'completed', description: 'Alergia en la piel', address: 'Paseo de la Castellana 100' },
  { id: '5', patientId: 'p1', doctorId: 'd3', requestDate: Date.now() - 604800000, status: 'cancelled', description: 'Chequeo general', address: 'Calle Gran Vía 50' },
  { id: '6', patientId: 'p1', doctorId: 'd2', requestDate: Date.now() - 300000, status: 'en-route', description: 'Corte en la mano', address: 'Calle de Alcalá 200' },
];

const statusConfig: { [key in RequestStatus]: { text: string; icon: React.ElementType; color: string } } = {
  pending: { text: 'Pendiente', icon: Clock, color: 'bg-yellow-500' },
  accepted: { text: 'Aceptada', icon: CheckCircle, color: 'bg-blue-500' },
  'en-route': { text: 'En Camino', icon: Truck, color: 'bg-indigo-500' },
  completed: { text: 'Completada', icon: CheckCircle, color: 'bg-green-500' },
  cancelled: { text: 'Cancelada', icon: XCircle, color: 'bg-red-500' },
};

function RequestItem({ request }: { request: AppointmentRequest }) {
  const { text, icon: Icon, color } = statusConfig[request.status];
  return (
    <div className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-card/90 transition-colors">
      <div className="flex-1">
        <p className="font-semibold text-lg">{request.description}</p>
        <p className="text-sm text-muted-foreground">{new Date(request.requestDate).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        <p className="text-sm text-muted-foreground">{request.address}</p>
      </div>
      <div className="flex items-center gap-4">
        <Badge className={`flex items-center gap-2 ${color} text-white`}>
          <Icon className="h-4 w-4" />
          <span>{text}</span>
        </Badge>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">Más opciones</span>
        </Button>
      </div>
    </div>
  );
}


export default function MyRequestsPage() {
  const activeRequests = mockRequests.filter(r => r.status === 'pending' || r.status === 'accepted' || r.status === 'en-route');
  const pastRequests = mockRequests.filter(r => r.status === 'completed' || r.status === 'cancelled');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mis Solicitudes</h1>
        <p className="text-muted-foreground">Revisa el estado de tus solicitudes activas y tu historial.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Activas</CardTitle>
          <CardDescription>Estas son tus solicitudes que están actualmente en proceso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeRequests.length > 0 ? (
            activeRequests.map(req => <RequestItem key={req.id} request={req} />)
          ) : (
            <p className="text-muted-foreground text-center py-4">No tienes solicitudes activas.</p>
          )}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Historial de Solicitudes</CardTitle>
          <CardDescription>Aquí puedes ver todas tus solicitudes pasadas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pastRequests.length > 0 ? (
            pastRequests.map(req => <RequestItem key={req.id} request={req} />)
          ) : (
            <p className="text-muted-foreground text-center py-4">Aún no tienes un historial de solicitudes.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
