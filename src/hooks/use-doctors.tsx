'use client';

import { useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { UserProfile } from '@/types';
import { collection, query, where, orderBy } from 'firebase/firestore';

export function useDoctors(filters?: {
  city?: string;
  zone?: string;
  specialty?: string;
  isOnline?: boolean;
}) {
  const firestore = useFirestore();

  const usersCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const doctorsQuery = useMemoFirebase(() => {
    if (!usersCollection) return null;

    let q = query(
      usersCollection,
      where('role', '==', 'doctor')
    );

    if (filters?.isOnline !== undefined) {
      q = query(q, where('isOnline', '==', filters.isOnline));
    }

    if (filters?.specialty) {
      q = query(q, where('specialty', '==', filters.specialty));
    }

    if (filters?.city) {
      q = query(q, where('city', '==', filters.city));
    }

    return q;
  }, [usersCollection, filters]);

  const { data, isLoading, error } = useCollection<UserProfile>(doctorsQuery);

  // Filter by zone if needed (since Firestore doesn't support multiple where clauses easily)
  const filteredData = filters?.zone && data
    ? data.filter((doctor) => doctor.city === filters.city) // Zone filtering would need additional field
    : data;

  return {
    doctors: filteredData as WithId<UserProfile>[] | null,
    isLoading,
    error,
  };
}

