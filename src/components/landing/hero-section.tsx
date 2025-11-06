'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Stethoscope, Clock, Shield, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth-provider';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function HeroSection() {
  const { user } = useAuth();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity }}
      className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20 sm:py-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-2 text-sm backdrop-blur-sm"
          >
            <Stethoscope className="h-4 w-4 text-primary" />
            <span className="font-medium">Atención médica a domicilio</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Atención Médica
            </span>
            <br />
            <span className="text-foreground">Cuando la Necesitas</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 text-lg text-muted-foreground sm:text-xl md:text-2xl"
          >
            Conectamos pacientes con doctores certificados en tiempo real.{' '}
            <span className="font-semibold text-foreground">
              Atención médica profesional en la comodidad de tu hogar.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
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
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {[
              { icon: Clock, value: '24/7', label: 'Disponible' },
              { icon: MapPin, value: '+50', label: 'Doctores' },
              { icon: Shield, value: '100%', label: 'Certificados' },
              { icon: Stethoscope, value: '+1000', label: 'Consultas' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

