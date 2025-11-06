'use client';

import { useRatings } from '@/hooks/use-ratings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';

interface RatingsListProps {
  doctorId: string;
  showAverage?: boolean;
}

export function RatingsList({ doctorId, showAverage = true }: RatingsListProps) {
  const { ratings, isLoading, averageRating, totalRatings } = useRatings(doctorId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!ratings || ratings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calificaciones</CardTitle>
          <CardDescription>Este doctor aún no tiene calificaciones.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Calificaciones</CardTitle>
            <CardDescription>
              {totalRatings} {totalRatings === 1 ? 'calificación' : 'calificaciones'}
            </CardDescription>
          </div>
          {showAverage && averageRating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ratings
            .sort((a, b) => b.date - a.date)
            .map((rating) => (
              <RatingItem key={rating.id} rating={rating} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RatingItem({ rating }: { rating: any }) {
  const { user: patient } = useUser(rating.patientId);

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <Avatar className="h-10 w-10">
        <AvatarImage src={patient?.profilePictureURL} alt={patient?.firstName} />
        <AvatarFallback>
          {patient?.firstName?.[0]}{patient?.lastName?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="font-semibold text-sm">
              {patient?.firstName} {patient?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(rating.date), { addSuffix: true, locale: es })}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'h-4 w-4',
                  rating.score >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                )}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{rating.comment}</p>
      </div>
    </div>
  );
}

