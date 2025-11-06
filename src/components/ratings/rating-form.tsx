'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Star, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-provider';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ratingSchema = z.object({
  score: z.number().min(1).max(5),
  comment: z.string().min(10, { message: 'Por favor, escribe un comentario de al menos 10 caracteres.' }),
});

type RatingFormValues = z.infer<typeof ratingSchema>;

interface RatingFormProps {
  doctorId: string;
  appointmentId: string;
  onSuccess?: () => void;
}

export function RatingForm({ doctorId, appointmentId, onSuccess }: RatingFormProps) {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      score: 0,
      comment: '',
    },
  });

  const onSubmit = async (data: RatingFormValues) => {
    if (!user || !firestore) {
      toast.error('Error', { description: 'No se pudo enviar la calificación. Por favor, inicia sesión nuevamente.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const ratingsCollection = collection(firestore, 'ratings');
      await addDoc(ratingsCollection, {
        doctorId,
        patientId: user.uid,
        score: data.score,
        comment: data.comment,
        date: Date.now(),
        appointmentId, // Link to appointment
      });

      toast.success('Calificación Enviada', { description: 'Gracias por calificar al doctor.' });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Error', { description: 'No se pudo enviar la calificación. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedScore = form.watch('score');
  const displayScore = hoveredStar || selectedScore;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calificar Doctor</CardTitle>
        <CardDescription>
          Comparte tu experiencia con este doctor para ayudar a otros pacientes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calificación</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(null)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={cn(
                              'h-8 w-8 transition-colors',
                              displayScore >= star
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                            )}
                          />
                        </button>
                      ))}
                      {selectedScore > 0 && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          {selectedScore === 1 && 'Muy malo'}
                          {selectedScore === 2 && 'Malo'}
                          {selectedScore === 3 && 'Regular'}
                          {selectedScore === 4 && 'Bueno'}
                          {selectedScore === 5 && 'Excelente'}
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentario</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe tu experiencia con este doctor..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mínimo 10 caracteres. Sé específico sobre tu experiencia.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting || selectedScore === 0} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Calificación'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

