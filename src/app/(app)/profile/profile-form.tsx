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
import { useAuth } from '@/hooks/use-auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload, DollarSign, MapPin, Award, Languages } from 'lucide-react';
import { useState } from 'react';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COLOMBIAN_CITIES, COLOMBIAN_ZONES, MEDICAL_SPECIALTIES } from '@/lib/colombia-data';


const baseProfileSchema = {
  firstName: z.string().min(2, { message: 'El nombre es requerido.' }),
  lastName: z.string().min(2, { message: 'El apellido es requerido.' }),
  phone: z.string().optional(),
  city: z.string().optional(),
};

const doctorProfileSchema = {
  ...baseProfileSchema,
  specialty: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0).max(50).optional(),
  consultationPrice: z.coerce.number().min(0).optional(),
  serviceRadius: z.coerce.number().min(1).max(100).optional(),
  languages: z.string().optional(), // Comma-separated for now
  certifications: z.string().optional(), // Comma-separated for now
};

const profileSchema = z.object(baseProfileSchema);
const doctorProfileSchemaZod = z.object(doctorProfileSchema);

type ProfileFormValues = z.infer<typeof profileSchema>;
type DoctorProfileFormValues = z.infer<typeof doctorProfileSchemaZod>;

export function ProfileForm() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const isDoctor = user?.role === 'doctor';

  const schema = isDoctor ? doctorProfileSchemaZod : profileSchema;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      city: user?.city || '',
      ...(isDoctor && {
        specialty: user?.specialty || '',
        yearsOfExperience: user?.yearsOfExperience || undefined,
        consultationPrice: user?.consultationPrice || undefined,
        serviceRadius: user?.serviceRadius || undefined,
        languages: user?.languages?.join(', ') || '',
        certifications: user?.certifications?.join(', ') || '',
      }),
    },
    values: user ? {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      city: user.city || '',
      zone: user.zone || '',
      ...(isDoctor && {
        specialty: user.specialty || '',
        yearsOfExperience: user.yearsOfExperience || undefined,
        consultationPrice: user.consultationPrice || undefined,
        serviceRadius: user.serviceRadius || undefined,
        languages: user.languages?.join(', ') || '',
        certifications: user.certifications?.join(', ') || '',
      }),
    } : undefined,
  });

  const onSubmit = async (data: ProfileFormValues | DoctorProfileFormValues) => {
    if (!user) return;
    setIsLoading(true);

    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      
      // Process doctor-specific fields
      const updateData: any = { ...data };
      if (isDoctor && 'languages' in data && typeof data.languages === 'string') {
        updateData.languages = data.languages.split(',').map(l => l.trim()).filter(Boolean);
      }
      if (isDoctor && 'certifications' in data && typeof data.certifications === 'string') {
        updateData.certifications = data.certifications.split(',').map(c => c.trim()).filter(Boolean);
      }
      
      updateDocumentNonBlocking(userDocRef, updateData);

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
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedCity(value);
                  }}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu ciudad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COLOMBIAN_CITIES.map((city) => (
                      <SelectItem key={city.value} value={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {isDoctor && (
            <>
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Información Profesional</h3>
              </div>

              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidad Médica</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu especialidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MEDICAL_SPECIALTIES.map((specialty) => (
                          <SelectItem key={specialty.value} value={specialty.value}>
                            {specialty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Años de Experiencia
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ej: 10" {...field} />
                      </FormControl>
                      <FormDescription>
                        Años de experiencia práctica
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consultationPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Precio por Consulta (MXN)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ej: 500" {...field} />
                      </FormControl>
                      <FormDescription>
                        Precio estándar por consulta a domicilio
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="serviceRadius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Radio de Servicio (km)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej: 20" {...field} />
                    </FormControl>
                    <FormDescription>
                      Distancia máxima que estás dispuesto a viajar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      Idiomas que Hablas
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Español, Inglés, Francés" {...field} />
                    </FormControl>
                    <FormDescription>
                      Separa los idiomas con comas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificaciones y Licencias</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ej: Cédula Profesional 123456, Certificación en Cardiología Avanzada"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Lista tus certificaciones y licencias, separadas por comas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </form>
      </Form>
    </div>
  );
}
