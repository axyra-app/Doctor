'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MapPin, UserCheck, MessageSquare, Star } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth-provider';

const steps = [
  {
    step: 1,
    icon: MapPin,
    title: 'Solicita una Consulta',
    description: 'Crea una solicitud indicando tu ubicación, especialidad requerida y nivel de urgencia.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    step: 2,
    icon: UserCheck,
    title: 'Un Doctor Acepta',
    description: 'Los doctores cercanos reciben tu solicitud y uno acepta tu caso.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    step: 3,
    icon: MessageSquare,
    title: 'Sigue el Progreso',
    description: 'Chatea con tu doctor y sigue su ubicación en tiempo real mientras se dirige a ti.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    step: 4,
    icon: Star,
    title: 'Consulta y Califica',
    description: 'Recibe atención médica profesional y califica tu experiencia.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
];

export function HowItWorksSection() {
  const { user } = useAuth();

  return (
    <section className="py-20 sm:py-32 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-lg text-muted-foreground">
            Proceso simple y rápido en 4 pasos
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border -z-10">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary" />
                  </div>
                )}

                <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${step.bgColor}`}>
                        <Icon className={`h-6 w-6 ${step.color}`} />
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          {!user ? (
            <Button asChild size="lg" className="text-base px-8 py-6">
              <Link href="/signup">
                Comenzar Ahora
                <CheckCircle2 className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="text-base px-8 py-6">
              <Link href="/requests/new">
                Solicitar Consulta
                <CheckCircle2 className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

