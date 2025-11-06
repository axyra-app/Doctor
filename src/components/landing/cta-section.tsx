'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth-provider';

export function CTASection() {
  const { user } = useAuth();

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              ¿Listo para Comenzar?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              Únete a miles de pacientes y doctores que ya están usando DoctorAtHome.
              Atención médica profesional cuando y donde la necesites.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {!user ? (
                <>
                  <Button asChild size="lg" className="w-full sm:w-auto text-base px-8 py-6">
                    <Link href="/signup">
                      Crear Cuenta Gratis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6">
                    <Link href="/login">Ya Tengo Cuenta</Link>
                  </Button>
                </>
              ) : (
                <Button asChild size="lg" className="w-full sm:w-auto text-base px-8 py-6">
                  <Link href={user.role === 'doctor' ? '/appointments' : '/requests/new'}>
                    {user.role === 'doctor' ? 'Ver Solicitudes' : 'Solicitar Consulta'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

