'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, MapPin, Phone, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-provider';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { LocationPicker } from '@/components/maps/location-picker';
import { geocodeAddress } from '@/lib/mapbox';
import { PageHeader } from '@/components/page-header';

const requestSchema = z.object({
  description: z.string().min(20, { message: 'Por favor, describe tu problema con más detalle (mínimo 20 caracteres).' }),
  address: z.string().min(10, { message: 'Por favor, introduce una dirección completa.' }),
  specialty: z.string().min(1, { message: 'Por favor, selecciona una especialidad médica.' }),
  urgency: z.enum(['low', 'medium', 'high', 'emergency'], {
    required_error: 'Por favor, selecciona el nivel de urgencia.',
  }),
  contactPhone: z.string().optional(),
  additionalNotes: z.string().max(500, { message: 'Las notas adicionales no pueden exceder 500 caracteres.' }).optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

const specialties = [
  'Médico General',
  'Pediatra',
  'Cardiólogo',
  'Dermatólogo',
  'Ginecólogo',
  'Oftalmólogo',
  'Otorrinolaringólogo',
  'Neurólogo',
  'Psiquiatra',
  'Traumatólogo',
  'Urgenciólogo',
  'Otro',
];

const urgencyLabels = {
  low: 'Baja - Puede esperar',
  medium: 'Media - En las próximas horas',
  high: 'Alta - Necesita atención pronto',
  emergency: 'Emergencia - Atención inmediata',
};

export default function NewRequestPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      description: '',
      address: '',
      specialty: '',
      urgency: 'medium',
      contactPhone: '',
      additionalNotes: '',
    },
  });

  const onSubmit = async (data: RequestFormValues) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo crear la solicitud. Por favor, inicia sesión nuevamente.',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Geocode address if location not selected manually
      let location = selectedLocation;
      if (!location && data.address) {
        const geocoded = await geocodeAddress(data.address);
        if (geocoded) {
          location = geocoded;
        }
      }

      const appointmentsCollection = collection(firestore, 'appointments');
      
      const appointmentData = {
        patientId: user.uid,
        doctorId: null,
        requestDate: Date.now(),
        status: 'pending' as const,
        description: data.description,
        address: data.address,
        specialty: data.specialty,
        urgency: data.urgency,
        contactPhone: data.contactPhone || user.phone || '',
        additionalNotes: data.additionalNotes || '',
        ...(location && { location }),
      };

      await addDoc(appointmentsCollection, appointmentData);
      
      toast({
        title: 'Solicitud enviada exitosamente',
        description: 'Hemos notificado a los doctores cercanos. Recibirás una notificación cuando alguien acepte tu solicitud.',
      });
      router.push('/requests');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo enviar tu solicitud. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Nueva Solicitud de Atención"
        description="Completa el formulario para solicitar una visita médica a domicilio."
      />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Nivel de Urgencia
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el nivel de urgencia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">{urgencyLabels.low}</SelectItem>
                        <SelectItem value="medium">{urgencyLabels.medium}</SelectItem>
                        <SelectItem value="high">{urgencyLabels.high}</SelectItem>
                        <SelectItem value="emergency">{urgencyLabels.emergency}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecciona qué tan urgente es tu necesidad de atención médica.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidad Médica Requerida</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una especialidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Indica qué tipo de especialista médico necesitas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Detallada del Problema</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe tus síntomas, cuándo comenzaron, qué tan severos son, medicamentos que estás tomando, etc. (mínimo 20 caracteres)"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mientras más detalles proporciones, mejor podremos ayudarte.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Dirección para la Visita
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Calle, número, colonia, ciudad, código postal" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // Clear selected location when address changes
                          setSelectedLocation(null);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Dirección completa donde necesitas que te visite el médico. Puedes seleccionar la ubicación en el mapa a continuación.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Picker Map */}
              <LocationPicker
                onLocationSelect={(location) => {
                  setSelectedLocation({ lat: location.lat, lng: location.lng });
                  // Optionally update address field if reverse geocoding is available
                }}
                address={form.watch('address')}
                disabled={isLoading}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Teléfono de Contacto (Opcional)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"
                        placeholder={user?.phone || "+52 123 456 7890"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Número de teléfono donde el médico puede contactarte. Si no lo especificas, usaremos el de tu perfil.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Adicionales (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Instrucciones especiales, acceso al edificio, horarios preferidos, etc."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Cualquier información adicional que pueda ayudar al médico.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="flex-1 sm:flex-none"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Solicitud
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
