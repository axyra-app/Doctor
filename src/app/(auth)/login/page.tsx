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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth as useFirebaseAuth } from '@/firebase';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth as useAppAuth } from '@/hooks/use-auth-provider';
import { signInWithEmailAndPassword } from 'firebase/auth';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firebaseAuth = useFirebaseAuth();
  const { user, loading: authLoading } = useAppAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    // Si la autenticación ha terminado y tenemos un usuario, redirigir al dashboard.
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await signInWithEmailAndPassword(firebaseAuth, values.email, values.password);
      
      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Serás redirigido al panel de control.',
      });
      // Redirección explícita después del éxito.
      router.push('/dashboard');

    } catch (error: any) {
      let message = 'Ha ocurrido un error inesperado.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'El correo electrónico o la contraseña son incorrectos.';
      }
      setErrorMessage(message);
      toast({
        variant: 'destructive',
        title: 'Error al iniciar sesión',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Muestra el spinner si el AuthProvider está cargando (comprobación inicial) o si ya hay un usuario y estamos a punto de redirigir.
  if (authLoading && !isSubmitting) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Logo className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl">Bienvenido a DoctorExpress</CardTitle>
        <CardDescription>Inicia sesión para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@email.com" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {errorMessage && (
              <p className="text-sm font-medium text-destructive">{errorMessage}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar sesión
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
