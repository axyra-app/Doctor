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
  FormDescription,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { Loader2, Sparkles, MapPin, Star, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { COLOMBIAN_CITIES, COLOMBIAN_ZONES, MEDICAL_SPECIALTIES } from '@/lib/colombia-data';
import { useDoctors } from '@/hooks/use-doctors';
import { calculateDistance } from '@/lib/mapbox';
import { useGeolocation } from '@/hooks/use-geolocation';
import { DoctorCard } from '@/components/doctors/doctor-card';

const formSchema = z.object({
  medicalSpecialty: z.string().min(1, { message: 'La especialidad es requerida.' }),
  city: z.string().min(1, { message: 'La ciudad es requerida.' }),
  zone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SuggestDoctorsForm() {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const { lat: userLat, lng: userLng } = useGeolocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicalSpecialty: '',
      city: '',
      zone: '',
    },
  });

  const specialty = form.watch('medicalSpecialty');
  const city = form.watch('city');

  // Get doctors from Firestore based on filters
  const { doctors, isLoading: isLoadingDoctors } = useDoctors({
    specialty: specialty || undefined,
    city: city || undefined,
    isOnline: true, // Only show online doctors
  });

  // Calculate distances and sort
  const sortedDoctors = useMemo(() => {
    if (!doctors || doctors.length === 0) return [];

    return doctors
      .map((doctor) => {
        let distance = null;
        if (userLat && userLng && doctor.currentLocation) {
          distance = calculateDistance(
            userLat,
            userLng,
            doctor.currentLocation.lat,
            doctor.currentLocation.lng
          );
        }

        // Calculate score: online (40%) + distance (30%) + experience (20%) + verified (10%)
        let score = 0;
        if (doctor.isOnline) {
          score += 40;
        }
        if (distance !== null) {
          // Closer is better (inverse distance, max 30km = 0 points, 0km = 30 points)
          const distanceScore = Math.max(0, 30 - (distance / 30) * 30);
          score += distanceScore;
        } else {
          score += 15; // Default if no location
        }
        if (doctor.yearsOfExperience) {
          score += Math.min(20, (doctor.yearsOfExperience / 50) * 20);
        }
        if (doctor.verified) {
          score += 10;
        }

        return {
          ...doctor,
          distance,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5
  }, [doctors, userLat, userLng]);

  const availableZones = city ? COLOMBIAN_ZONES[city as keyof typeof COLOMBIAN_ZONES] || [] : [];

  const onSubmit = async (data: FormValues) => {
    if (!doctors || doctors.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No se encontraron doctores',
        description: 'No hay doctores disponibles con los criterios seleccionados.',
      });
      return;
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="medicalSpecialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidad Médica</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una especialidad" />
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
                      form.setValue('zone', ''); // Reset zone when city changes
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una ciudad" />
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

            {availableZones.length > 0 && (
              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zona (Opcional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una zona" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Todas las zonas</SelectItem>
                        {availableZones.map((zone) => (
                          <SelectItem key={zone.value} value={zone.value}>
                            {zone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormDescription>
            Selecciona la especialidad y ubicación para encontrar doctores disponibles en Colombia.
          </FormDescription>
        </form>
      </Form>

      {/* Results */}
      {isLoadingDoctors ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Buscando doctores disponibles...</p>
        </div>
      ) : sortedDoctors && sortedDoctors.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {sortedDoctors.length} {sortedDoctors.length === 1 ? 'Doctor Encontrado' : 'Doctores Encontrados'}
            </h3>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Disponibles Ahora
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDoctors.map((doctor) => (
              <DoctorCard key={doctor.uid} doctor={doctor} distance={doctor.distance} score={doctor.score} />
            ))}
          </div>
        </div>
      ) : specialty && city ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No se encontraron doctores</CardTitle>
            <CardDescription>
              No hay doctores disponibles con los criterios seleccionados. Intenta con otra especialidad o ciudad.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">Selecciona criterios de búsqueda</CardTitle>
            <CardDescription>
              Elige una especialidad y ciudad para encontrar doctores disponibles en Colombia.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
