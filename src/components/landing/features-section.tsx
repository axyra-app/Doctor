'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Clock,
  MapPin,
  Shield,
  MessageCircle,
  Star,
  Heart,
  Zap,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Respuesta Rápida',
    description: 'Doctores disponibles en minutos. Atención inmediata cuando más la necesitas.',
  },
  {
    icon: MapPin,
    title: 'Tracking en Tiempo Real',
    description: 'Sigue la ubicación de tu doctor en tiempo real, estilo Uber. Sabes exactamente cuándo llegará.',
  },
  {
    icon: Shield,
    title: 'Doctores Certificados',
    description: 'Todos nuestros doctores están certificados y verificados. Tu salud en manos profesionales.',
  },
  {
    icon: MessageCircle,
    title: 'Chat en Tiempo Real',
    description: 'Comunícate directamente con tu doctor durante la consulta. Preguntas y respuestas instantáneas.',
  },
  {
    icon: Star,
    title: 'Calificaciones y Reseñas',
    description: 'Lee las experiencias de otros pacientes y califica a tu doctor después de cada consulta.',
  },
  {
    icon: Heart,
    title: 'Atención Personalizada',
    description: 'Cada consulta es única. Atención médica personalizada en la comodidad de tu hogar.',
  },
  {
    icon: Zap,
    title: 'Múltiples Especialidades',
    description: 'Médicos generales, pediatras, cardiólogos y más. Encuentra el especialista que necesitas.',
  },
  {
    icon: Users,
    title: 'Fácil de Usar',
    description: 'Plataforma intuitiva. Solicita una consulta en minutos desde tu dispositivo móvil o computadora.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            ¿Por Qué Elegirnos?
          </h2>
          <p className="text-lg text-muted-foreground">
            Ofrecemos la mejor experiencia en atención médica a domicilio
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

