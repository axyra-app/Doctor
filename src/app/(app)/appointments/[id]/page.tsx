'use client';

import { useParams } from 'next/navigation';
import { useDocument } from '@/firebase/firestore/use-document';
import { AppointmentRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { updateDocument } from '@/firebase/firestore/update-document';
import { useAuth } from '@/hooks/use-auth-provider';
import { useUser } from '@/hooks/use-user';
import { Loader2, User, MapPin, Calendar, CheckCircle, ShieldCheck, Stethoscope, Phone, AlertCircle, FileText, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft } from 'lucide-react';

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
  const isPatientOwner = currentUser?.uid === appointment.patientId;

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

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    accepted: 'bg-blue-100 text-blue-800 border-blue-200',
    'en-route': 'bg-purple-100 text-purple-800 border-purple-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const statusLabels = {
    pending: 'Pendiente',
    accepted: 'Aceptada',
    'en-route': 'En Camino',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHeader
          title="Detalles de la Solicitud"
          description="Información completa de la solicitud de atención médica"
          action={
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          }
        />
        {/* Card con estado y urgencia */}
        <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {appointment.urgency && (
                      <Badge className={urgencyColors[appointment.urgency]}>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {urgencyLabels[appointment.urgency]}
                      </Badge>
                    )}
                    <Badge className={statusColors[appointment.status]}>
                      {statusLabels[appointment.status]}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Información del Paciente */}
          <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary rounded-lg border">
            <User className="h-5 w-5 text-primary mt-0.5 sm:mt-1 flex-shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs sm:text-sm text-muted-foreground mb-1">Paciente</p>
              <p className="font-medium text-base sm:text-lg break-words">{patient?.firstName} {patient?.lastName}</p>
              {appointment.contactPhone && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span className="break-all">{appointment.contactPhone}</span>
                </p>
              )}
            </div>
          </div>

          {/* Especialidad Requerida */}
          {appointment.specialty && (
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary rounded-lg border">
              <Stethoscope className="h-5 w-5 text-primary flex-shrink-0"/>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-xs sm:text-sm text-muted-foreground mb-1">Especialidad Requerida</p>
                <p className="font-medium text-sm sm:text-base break-words">{appointment.specialty}</p>
              </div>
            </div>
          )}

          {/* Dirección */}
          <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary rounded-lg border">
            <MapPin className="h-5 w-5 text-primary mt-0.5 sm:mt-1 flex-shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs sm:text-sm text-muted-foreground mb-1">Dirección de Visita</p>
              <p className="font-medium text-sm sm:text-base break-words">{appointment.address}</p>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary rounded-lg border">
            <Calendar className="h-5 w-5 text-primary mt-0.5 sm:mt-0 flex-shrink-0"/>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-xs sm:text-sm text-muted-foreground mb-1">Fecha de Solicitud</p>
              <p className="font-medium text-sm sm:text-base">
                {new Date(appointment.requestDate).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                Hace {formatDistanceToNow(new Date(appointment.requestDate), { addSuffix: true, locale: es })}
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div className="p-4 bg-secondary rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-primary"/>
              <p className="font-semibold">Descripción del Problema</p>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{appointment.description}</p>
          </div>

          {/* Notas Adicionales */}
          {appointment.additionalNotes && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">Notas Adicionales</p>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed whitespace-pre-wrap">
                {appointment.additionalNotes}
              </p>
            </div>
          )}

          {/* Doctor Asignado */}
          {doctor && (
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 rounded-lg">
              <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400"/>
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">Doctor Asignado</p>
                <p className="text-blue-800 dark:text-blue-200">Dr. {doctor.firstName} {doctor.lastName}</p>
                {doctor.specialty && (
                  <p className="text-sm text-blue-700 dark:text-blue-300">{doctor.specialty}</p>
                )}
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="pt-4 space-y-3">
            {currentUser?.role === 'doctor' && appointment.status === 'pending' && (
              <Button onClick={handleAcceptAppointment} className="w-full" size="lg">
                <CheckCircle className="mr-2 h-5 w-5"/> Aceptar Solicitud
              </Button>
            )}
            
            {isDoctorOwner && appointment.status === 'accepted' && (
              <Button onClick={handleCompleteAppointment} className="w-full" size="lg" variant="default">
                <ShieldCheck className="mr-2 h-5 w-5"/> Marcar como Completada
              </Button>
            )}

            {isPatientOwner && appointment.status === 'pending' && (
              <Button 
                onClick={async () => {
                  try {
                    await updateDocument('appointments', appointment.id, { status: 'cancelled' });
                    toast.success('Solicitud Cancelada', { description: 'Tu solicitud ha sido cancelada.' });
                    router.push('/requests');
                  } catch (err) {
                    toast.error('Error', { description: 'No se pudo cancelar la solicitud.' });
                  }
                }}
                className="w-full" 
                size="lg" 
                variant="destructive"
              >
                Cancelar Solicitud
              </Button>
            )}

            {appointment.status === 'completed' && (
              <div className="text-center font-medium p-4 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-800">
                ✓ Esta cita fue completada exitosamente.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
