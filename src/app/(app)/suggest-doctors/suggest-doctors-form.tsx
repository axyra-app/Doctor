'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { suggestOptimalDoctors, SuggestOptimalDoctorsOutput } from '@/ai/flows/suggest-optimal-doctors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  medicalSpecialty: z.string().min(3, { message: "La especialidad es requerida." }),
  location: z.string().min(3, { message: "La ubicación es requerida." }),
  patientReviews: z.string().min(10, { message: "Se requieren algunas reseñas." }),
  doctorAvailability: z.string().min(5, { message: "La disponibilidad es requerida." }),
  pricing: z.string().min(5, { message: "La información de precios es requerida." }),
  insuranceCoverage: z.string().min(3, { message: "La cobertura de seguro es requerida." }),
});

type FormValues = z.infer<typeof formSchema>;

export function SuggestDoctorsForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestOptimalDoctorsOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicalSpecialty: 'Cardiología',
      location: 'Ciudad de México',
      patientReviews: 'Dr. Smith tiene 5 estrellas por su excelente trato. Dr. Jones es conocido por ser muy puntual.',
      doctorAvailability: 'Dr. Smith disponible L-V 9am-5pm. Dr. Jones disponible M-J 10am-6pm.',
      pricing: 'Consulta con Dr. Smith $100. Consulta con Dr. Jones $120.',
      insuranceCoverage: 'Ambos doctores aceptan Seguros Monterrey y GNP.',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await suggestOptimalDoctors(data);
      setResult(response);
      toast({
        title: 'Sugerencias generadas',
        description: 'Hemos encontrado doctores que se ajustan a tus criterios.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al generar sugerencias',
        description: 'No se pudo contactar al asistente de IA. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="medicalSpecialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidad Médica</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Pediatría" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación (Ciudad/Zona)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Madrid, España" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="patientReviews"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reseñas de Pacientes (simulado)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Información sobre reseñas de doctores cercanos..." {...field} rows={3}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="doctorAvailability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disponibilidad de Doctores (simulado)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Horarios de doctores..." {...field} rows={3}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="pricing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precios (simulado)</FormLabel>
                  <FormControl>
                    <Input placeholder="Costos de consulta..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceCoverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cobertura de Seguro (simulado)</FormLabel>
                  <FormControl>
                    <Input placeholder="Aseguradoras aceptadas..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Obtener Sugerencias
          </Button>
        </form>
      </Form>

      {isLoading && (
         <div className="mt-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Analizando la mejor opción para ti...</p>
        </div>
      )}

      {result && (
        <Card className="mt-8 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-primary"/>
              Doctores Recomendados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
              {result.rankedDoctorList}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
