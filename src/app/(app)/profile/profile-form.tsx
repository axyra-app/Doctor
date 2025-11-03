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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { useState } from 'react';
// import { doc, updateDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '@/lib/firebase/firebase';

const profileSchema = z.object({
  firstName: z.string().min(2, { message: 'El nombre es requerido.' }),
  lastName: z.string().min(2, { message: 'El apellido es requerido.' }),
  phone: z.string().optional(),
  city: z.string().optional(),
  specialty: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      city: user?.city || '',
      specialty: user?.specialty || '',
    },
    values: user ? {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      city: user.city || '',
      specialty: user.specialty || '',
    } : undefined,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Stub for Firebase update
      // const userDocRef = doc(db, 'users', user.uid);
      // await updateDoc(userDocRef, data);

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: 'Perfil actualizado',
        description: 'Tu información ha sido guardada correctamente.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar tu perfil.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = (firstName: string = '', lastName: string = '') => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (authLoading) {
    return <Loader2 className="mx-auto h-8 w-8 animate-spin" />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-32 w-32">
          <AvatarImage src={user?.profilePictureURL} alt="Foto de perfil" />
          <AvatarFallback className="text-4xl">{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
        </Avatar>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Cambiar foto
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu apellido" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Tu número de teléfono" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input placeholder="Tu ciudad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {user?.role === 'doctor' && (
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidad Médica</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Cardiología" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </form>
      </Form>
    </div>
  );
}
