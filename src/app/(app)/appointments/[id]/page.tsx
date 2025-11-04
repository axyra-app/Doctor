'use client';

import { useParams } from 'next/navigation';
import { useDocument } from '@/firebase/firestore/use-document';
import { AppointmentRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateDocument } from '@/firebase/firestore/update-document';
import { useAuth } from '@/hooks/use-auth-provider';
import { useUser } from '@/hooks/use-user';
import { Loader2, User, MapPin, Calendar, CheckCircle, ShieldCheck, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AppointmentDetailsPage() {
  const { id: appointmentId } = useParams();
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const { data: appointment, isLoading, error } = useDocument<AppointmentRequest>(
    `appointments/${appointmentId}`
  );

  const { user: doctor } = useUser(appointment?.doctorId);
  const { user: patient } = useUser(appointment?.patientId);

  const handleAcceptAppointment = async () => {
    if (!currentUser || currentUser.role !== 'doctor' || !appointment) return;

    try {
      await updateDocument('appointments', appointment.id, {
        status: 'accepted',
        doctorId: currentUser.uid,
      });
      toast.success('Cita Aceptada', { description: 'La cita ha sido asignada y notificada al paciente.' });
      router.push('/dashboard');
    } catch (err) {
      toast.error('Error', { description: 'Hubo un problema al aceptar la cita.' });
    }
  };

  const handleCompleteAppointment = async () => {
    if (!currentUser || currentUser.role !== 'doctor' || !appointment) return;

    try {
      await updateDocument('appointments', appointment.id, { status: 'completed' });
      toast.success('Cita Completada', { description: 'La cita ha sido marcada como completada.' });
      router.push('/dashboard');
    } catch (err) {
      toast.error('Error', { description: 'Hubo un problema al completar la cita.' });
    }
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error || !appointment) {
    return <div className="text-center py-10">No se pudo cargar la cita o no existe.</div>;
  }

  const isDoctorOwner = currentUser?.uid === appointment.doctorId;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Solicitud</CardTitle>
          <CardDescription>Revisa la información de la solicitud y responde al paciente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-secondary rounded-md border">
            <User className="h-6 w-6 text-primary"/>
            <div>
              <p className="font-semibold">Paciente</p>
              <p>{patient?.firstName} {patient?.lastName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MapPin className="h-6 w-6 text-primary"/>
            <div>
              <p className="font-semibold">Dirección</p>
              <p>{appointment.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="h-6 w-6 text-primary"/>
            <div>
              <p className="font-semibold">Fecha de Solicitud</p>
              <p>{new Date(appointment.requestDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-2">Descripción del problema</p>
            <p className="p-4 bg-secondary rounded-md border">{appointment.description}</p>
          </div>

          {doctor && (
            <div className="flex items-center gap-4 p-4 bg-blue-50 border-blue-200 text-blue-800 rounded-md border">
              <Stethoscope className="h-6 w-6 text-blue-600"/>
              <div>
                <p className="font-semibold">Doctor Asignado</p>
                <p>Dr. {doctor.firstName} {doctor.lastName}</p>
              </div>
            </div>
          )}

          {currentUser?.role === 'doctor' && appointment.status === 'pending' && (
            <Button onClick={handleAcceptAppointment} className="w-full mt-4">
              <CheckCircle className="mr-2 h-4 w-4"/> Aceptar Cita
            </Button>
          )}
          
          {isDoctorOwner && appointment.status === 'accepted' && (
            <Button onClick={handleCompleteAppointment} className="w-full mt-4">
              <ShieldCheck className="mr-2 h-4 w-4"/> Marcar como Completada
            </Button>
          )}

          {appointment.status === 'completed' && (
             <div className="text-center font-medium p-3 bg-green-100 text-green-800 rounded-md border border-green-200">
                Esta cita fue completada.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
