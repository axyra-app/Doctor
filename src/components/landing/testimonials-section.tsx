'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
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

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Lo Que Dicen Nuestros Usuarios
          </h2>
          <p className="text-lg text-muted-foreground">
            Miles de pacientes y doctores confían en nosotros
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
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
          ))}
        </div>
      </div>
    </section>
  );
}

