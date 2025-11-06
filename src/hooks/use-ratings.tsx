'use client';

import { useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { Rating } from '@/types';
import { collection, query, where } from 'firebase/firestore';

export function useRatings(doctorId?: string) {
  const firestore = useFirestore();

  const ratingsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'ratings');
  }, [firestore]);

  const ratingsQuery = useMemoFirebase(() => {
    if (!ratingsCollection || !doctorId) return null;
    return query(ratingsCollection, where('doctorId', '==', doctorId));
  }, [ratingsCollection, doctorId]);

  const { data, isLoading, error } = useCollection<Rating>(ratingsQuery);

  // Calculate average rating
  const averageRating = data && data.length > 0
    ? data.reduce((sum, rating) => sum + rating.score, 0) / data.length
    : null;

  return {
    ratings: data as WithId<Rating>[] | null,
    isLoading,
    error,
    averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
    totalRatings: data?.length || 0,
  };
}

export function useUserRating(doctorId: string, patientId: string) {
  const firestore = useFirestore();

  const ratingsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'ratings');
  }, [firestore]);

  const ratingQuery = useMemoFirebase(() => {
    if (!ratingsCollection || !doctorId || !patientId) return null;
    return query(
      ratingsCollection,
      where('doctorId', '==', doctorId),
      where('patientId', '==', patientId)
    );
  }, [ratingsCollection, doctorId, patientId]);

  const { data, isLoading, error } = useCollection<Rating>(ratingQuery);

  return {
    rating: data && data.length > 0 ? data[0] as WithId<Rating> : null,
    isLoading,
    error,
    hasRated: data && data.length > 0,
  };
}

