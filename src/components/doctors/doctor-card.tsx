'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, Clock, DollarSign, MapPin } from 'lucide-react';
import { UserProfile } from '@/types';
import { useRatings } from '@/hooks/use-ratings';
import Link from 'next/link';

interface DoctorCardProps {
  doctor: UserProfile & { uid: string };
  distance?: number | null;
  score?: number;
}

export function DoctorCard({ doctor, distance, score }: DoctorCardProps) {
  const { averageRating, totalRatings } = useRatings(doctor.uid);

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={doctor.profilePictureURL} alt={doctor.firstName} />
              <AvatarFallback>
                {doctor.firstName[0]}
                {doctor.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                Dr. {doctor.firstName} {doctor.lastName}
              </CardTitle>
              <CardDescription>{doctor.specialty}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Rating */}
        {averageRating && averageRating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({totalRatings} {totalRatings === 1 ? 'calificación' : 'calificaciones'})
            </span>
          </div>
        )}

        {/* Experience */}
        {doctor.yearsOfExperience && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{doctor.yearsOfExperience} años de experiencia</span>
          </div>
        )}

        {/* Price */}
        {doctor.consultationPrice && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-semibold">${doctor.consultationPrice.toLocaleString()} COP</span>
          </div>
        )}

        {/* Distance */}
        {distance !== null && distance !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{distance.toFixed(1)} km de distancia</span>
          </div>
        )}

        {/* Online Status */}
        {doctor.isOnline && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-fit">
            En línea
          </Badge>
        )}

        <Button asChild className="w-full mt-4" size="sm">
          <Link href={`/appointments?specialty=${doctor.specialty}`}>
            Ver Disponibilidad
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

