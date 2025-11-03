'use client';
import { useAuth } from '@/hooks/use-auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect will run when loading is complete.
    if (!loading) {
      if (user) {
        // If there's a user, go to the main dashboard.
        router.replace('/dashboard');
      } else {
        // If no user, go to the login page.
        router.replace('/login');
      }
    }
    // The dependencies are correct. The effect re-evaluates when loading or user state changes.
  }, [user, loading, router]);

  // Render a loading spinner while the auth state is being determined.
  // This is the expected view until the redirect happens.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
