'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth-provider';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AvailabilityToggle() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const isOnline = user?.isOnline ?? false;

  const handleToggle = async (checked: boolean) => {
    if (!user || !firestore) return;

    setIsLoading(true);
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        isOnline: checked,
        ...(checked && { 
          // Update last online time when going online
          lastOnlineAt: Date.now()
        })
      });

      toast.success(
        checked ? 'Estás en línea' : 'Estás fuera de línea',
        {
          description: checked 
            ? 'Los pacientes ahora pueden verte y asignarte solicitudes.'
            : 'No recibirás nuevas solicitudes hasta que vuelvas a estar en línea.'
        }
      );
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Error', {
        description: 'No se pudo actualizar tu estado de disponibilidad.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'doctor') return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-gray-400" />
          )}
          Disponibilidad
        </CardTitle>
        <CardDescription>
          {isOnline 
            ? 'Estás recibiendo solicitudes de pacientes'
            : 'Activa tu disponibilidad para recibir solicitudes'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="availability" className="text-base">
              {isOnline ? 'En línea' : 'Fuera de línea'}
            </Label>
            <p className="text-sm text-muted-foreground">
              {isOnline 
                ? 'Los pacientes pueden ver y asignarte solicitudes'
                : 'No recibirás nuevas solicitudes'
              }
            </p>
          </div>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <Switch
              id="availability"
              checked={isOnline}
              onCheckedChange={handleToggle}
              disabled={isLoading}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}



