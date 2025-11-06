'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stethoscope, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-provider';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Navbar() {
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.95)']
  );
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 1]);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      style={{
        backgroundColor: scrolled ? undefined : backgroundColor,
        borderBottomWidth: scrolled ? 1 : borderOpacity,
      }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DoctorAtHome</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Características
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Cómo Funciona
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Testimonios
            </Link>
            {user ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Navegación</SheetDescription>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                <Link
                  href="#features"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Características
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Cómo Funciona
                </Link>
                <Link
                  href="#testimonials"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Testimonios
                </Link>
                {user ? (
                  <Button asChild className="w-full">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login">Iniciar Sesión</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/signup">Registrarse</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}

