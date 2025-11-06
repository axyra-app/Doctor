'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Loader2 } from 'lucide-react';
import { useTestimonials } from '@/hooks/use-testimonials';
import { useUser } from '@/hooks/use-user';
import { motion } from 'framer-motion';
import { Rating } from '@/types';

// Fallback testimonials if no real data
const fallbackTestimonials = [
  {
    name: 'María González',
    role: 'Paciente',
    image: null,
    rating: 5,
    comment: 'Excelente servicio. El doctor llegó en menos de 30 minutos y fue muy profesional. La plataforma es muy fácil de usar.',
  },
  {
    name: 'Carlos Ramírez',
    role: 'Paciente',
    image: null,
    rating: 5,
    comment: 'Increíble poder ver en tiempo real dónde está el doctor. Me sentí muy tranquilo sabiendo que estaba en camino.',
  },
  {
    name: 'Ana Martínez',
    role: 'Paciente',
    image: null,
    rating: 5,
    comment: 'Como madre, es un alivio poder tener atención médica en casa. El chat en tiempo real fue muy útil para hacer preguntas.',
  },
  {
    name: 'Dr. Roberto Sánchez',
    role: 'Doctor',
    image: null,
    rating: 5,
    comment: 'Plataforma excelente para conectar con pacientes. El sistema de tracking y chat facilita mucho la comunicación.',
  },
];

function TestimonialCard({ 
  rating, 
  index 
}: { 
  rating: Rating & { id: string }; 
  index: number;
}) {
  const { user: patient } = useUser(rating.patientId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="border-2 hover:border-primary/50 transition-colors h-full">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= rating.score
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-4 italic">
            "{rating.comment}"
          </p>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={patient?.profilePictureURL || undefined} alt={patient?.firstName} />
              <AvatarFallback>
                {patient?.firstName?.[0]}{patient?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">
                {patient?.firstName && patient?.lastName 
                  ? `${patient.firstName} ${patient.lastName}`
                  : 'Usuario'}
              </p>
              <p className="text-xs text-muted-foreground">Paciente</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FallbackTestimonialCard({ 
  testimonial, 
  index 
}: { 
  testimonial: typeof fallbackTestimonials[0]; 
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="border-2 hover:border-primary/50 transition-colors h-full">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= testimonial.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-4 italic">
            "{testimonial.comment}"
          </p>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={testimonial.image || undefined} alt={testimonial.name} />
              <AvatarFallback>
                {testimonial.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const { ratings, isLoading } = useTestimonials(4);
  const hasRatings = ratings && ratings.length > 0;
  const testimonialsToShow = hasRatings ? ratings.slice(0, 4) : fallbackTestimonials.slice(0, 4);

  return (
    <section className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Lo Que Dicen Nuestros Usuarios
          </h2>
          <p className="text-lg text-muted-foreground">
            {hasRatings 
              ? `${ratings.length} ${ratings.length === 1 ? 'calificación' : 'calificaciones'} de pacientes reales`
              : 'Miles de pacientes y doctores confían en nosotros'}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {hasRatings
              ? testimonialsToShow.map((rating, index) => (
                  <TestimonialCard key={rating.id} rating={rating as Rating & { id: string }} index={index} />
                ))
              : testimonialsToShow.map((testimonial, index) => (
                  <FallbackTestimonialCard key={index} testimonial={testimonial} index={index} />
                ))}
          </div>
        )}
      </div>
    </section>
  );
}

