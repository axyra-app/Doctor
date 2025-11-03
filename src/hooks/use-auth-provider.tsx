'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useUser } from '@/firebase';
import type { UserProfile } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: firebaseUser, isUserLoading: isFirebaseUserLoading } = useUser();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserProfile({ uid: user.uid, ...userDoc.data() } as UserProfile);
      } else {
        // This case can happen if the user record exists in Auth but not in Firestore.
        // It's safer to treat them as not fully logged in.
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  }, [firestore]);

  useEffect(() => {
    // We are loading if Firebase is checking its user or if we have a Firebase user but haven't fetched their profile yet.
    if (isFirebaseUserLoading) {
      setLoading(true);
      return;
    }

    if (firebaseUser) {
      // Firebase user exists, now fetch our custom profile data.
      setLoading(true);
      fetchUserProfile(firebaseUser);
    } else {
      // No Firebase user, so no profile and we are done loading.
      setUserProfile(null);
      setLoading(false);
    }
  }, [firebaseUser, isFirebaseUserLoading, fetchUserProfile]);

  const logout = async () => {
    // The actual sign-out is handled by firebase.auth().signOut() in the component.
    // This function just clears our local state.
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user: userProfile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
