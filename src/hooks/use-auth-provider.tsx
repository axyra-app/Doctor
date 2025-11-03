'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
  const { user: firebaseUser, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (user: User) => {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserProfile({ uid: user.uid, ...userDoc.data() } as UserProfile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    };

    if (isUserLoading) {
      setLoading(true);
    } else if (firebaseUser) {
      fetchUserProfile(firebaseUser);
    } else {
      setUserProfile(null);
      setLoading(false);
    }
  }, [firebaseUser, isUserLoading, firestore]);

  const logout = async () => {
    // The actual sign out is handled by Firebase Auth listener,
    // but we can clear the profile state here.
    setUserProfile(null);
    // You might need to call a sign-out function from your firebase auth hook
    // e.g., (await import('@/firebase')).auth.signOut();
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
