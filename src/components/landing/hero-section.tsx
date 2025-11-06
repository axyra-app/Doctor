'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Stethoscope, Clock, Shield, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth-provider';

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-2 text-sm backdrop-blur-sm">
            <Stethoscope className="h-4 w-4 text-primary" />
            <span className="font-medium">Atención médica a domicilio</span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Atención Médica
            </span>
            <br />
            <span className="text-foreground">Cuando la Necesitas</span>
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Conectamos pacientes con doctores certificados en tiempo real.{' '}
            <span className="font-semibold text-foreground">
              Atención médica profesional en la comodidad de tu hogar.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {!user ? (
              <>
                <Button asChild size="lg" className="w-full sm:w-auto text-base px-8 py-6">
                  <Link href="/signup">
                    Comenzar Ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
              </>
            ) : (
              <Button asChild size="lg" className="w-full sm:w-auto text-base px-8 py-6">
                <Link href="/dashboard">
                  Ir al Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-muted-foreground">Disponible</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">+50</div>
              <div className="text-sm text-muted-foreground">Doctores</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">Certificados</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">+1000</div>
              <div className="text-sm text-muted-foreground">Consultas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

