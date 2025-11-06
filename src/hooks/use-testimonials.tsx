'use client';

import { useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { Rating } from '@/types';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useUser } from '@/hooks/use-user';

export interface Testimonial {
  id: string;
  name: string;
  role: 'Paciente' | 'Doctor';
  rating: number;
  comment: string;
  date: number;
  patientId?: string;
  doctorId?: string;
}

export function useTestimonials(maxCount: number = 4) {
  const firestore = useFirestore();

  const ratingsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'ratings');
  }, [firestore]);

  const ratingsQuery = useMemoFirebase(() => {
    if (!ratingsCollection) return null;
    return query(
      ratingsCollection,
      orderBy('date', 'desc'),
      limit(maxCount)
    );
  }, [ratingsCollection, maxCount]);

  const { data: ratings, isLoading, error } = useCollection<Rating>(ratingsQuery);

  return {
    ratings: ratings as WithId<Rating>[] | null,
    isLoading,
    error,
  };
}

// Hook to get testimonials with patient names
export function useTestimonialsWithNames(maxCount: number = 4) {
  const { ratings, isLoading, error } = useTestimonials(maxCount);

  // We'll need to fetch patient names separately
  // For now, return the ratings and let the component handle fetching names
  return {
    ratings,
    isLoading,
    error,
  };
}

