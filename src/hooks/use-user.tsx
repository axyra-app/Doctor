'use client';

import { useDocument } from '@/firebase/firestore/use-document';
import { UserProfile } from '@/types';

/**
 * A hook to fetch a user's profile.
 * @param {string | null | undefined} uid - The user's ID.
 * @returns {object} The user's profile data, loading state, and error.
 */
export function useUser(uid: string | null | undefined) {
  const path = uid ? `users/${uid}` : null;
  const { data: user, isLoading, error } = useDocument<UserProfile>(path);

  return { user, isLoading, error };
}
