'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const requestSchema = z.object({
  description: z.string().min(10, { message: 'Por favor, describe tu problema con más detalle.' }),
  address: z.string().min(10, { message: 'Por favor, introduce una dirección completa.' }),
  doctorType: z.string().min(3, { message: 'Por favor, especifica el tipo de doctor que necesitas.' }),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export default function NewRequestPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      description: '',
      address: '',
      doctorType: '',
    },
  });

  const onSubmit = async (data: RequestFormValues) => {
    setIsLoading(true);
    try {
      // Stub for creating request in Firebase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Solicitud enviada',
        description: 'Hemos notificado a los doctores cercanos. Recibirás una notificación pronto.',
      });
      router.push('/requests');
    } catch (error) {
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
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Nueva Solicitud de Atención</CardTitle>
          <CardDescription>
            Completa el formulario para solicitar una visita médica a domicilio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Problema</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe tus síntomas, qué te ocurre, etc."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doctorType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Doctor Requerido</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Médico general, Pediatra, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección para la Visita</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu dirección completa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Enviar Solicitud
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
