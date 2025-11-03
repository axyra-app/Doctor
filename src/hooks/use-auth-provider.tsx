'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { useUser } from '@/firebase';
import type { UserProfile } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
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
      // No iniciar carga si ya estamos cargando
      if (!loading) setLoading(true);
      const userDocRef = doc(firestore, 'users', user.uid);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile({ uid: user.uid, ...userDoc.data() } as UserProfile);
        } else {
          // Si el perfil no existe en Firestore, aún podemos tener un usuario de Firebase
          // pero sin perfil completo. Deslogueamos o manejamos el caso.
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (isUserLoading) {
      setLoading(true);
    } else if (firebaseUser) {
      fetchUserProfile(firebaseUser);
    } else {
      setUserProfile(null);
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseUser, isUserLoading, firestore]);

  const logout = async () => {
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user: userProfile, loading, setLoading, logout }}>
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
