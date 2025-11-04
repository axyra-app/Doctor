'use client';

import { useMemo } from 'react';
import { collection, query, where, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { AppointmentRequest, AppointmentStatus, UserRole } from '@/types';

// A hook to fetch appointments based on user role.
export function useAppointments(userRole: UserRole, uid?: string, status?: AppointmentStatus | AppointmentStatus[]) {
  const firestore = useFirestore();

  const appointmentsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'appointments') as DocumentData;
  }, [firestore]);

  const appointmentsQuery = useMemo(() => {
    if (!appointmentsCollection) return null;

    let q = query(appointmentsCollection);

    // If the user is a patient, fetch their appointments.
    if (userRole === 'patient' && uid) {
      q = query(appointmentsCollection, where('patientId', '==', uid));
    }

    // If the user is a doctor, fetch all pending appointments.
    if (userRole === 'doctor') {
      if (Array.isArray(status)) {
        q = query(appointmentsCollection, where('status', 'in', status));
      } else if (status) {
        q = query(appointmentsCollection, where('status', '==', status));
      }
    }
    
    // If the user is a doctor and a UID is provided, fetch appointments assigned to that doctor.
    if (userRole === 'doctor' && uid) {
      q = query(q, where('doctorId', '==', uid));
    }

    // To prevent "useMemo" errors, I will mark the query as memoized.
    (q as any).__memo = true;
    return q;
  }, [appointmentsCollection, userRole, uid, status]);

  const { data, isLoading, error } = useCollection<AppointmentRequest>(appointmentsQuery);

  return { data: data as WithId<AppointmentRequest>[] | null, isLoading, error };
}
