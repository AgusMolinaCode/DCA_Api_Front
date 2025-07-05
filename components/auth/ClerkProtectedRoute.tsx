"use client";

import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ClerkProtectedRouteProps {
  children: React.ReactNode;
}

export function ClerkProtectedRoute({ children }: ClerkProtectedRouteProps) {
  const { isSignedIn, isLoaded, user } = useUser();
  const { getToken, userId } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Marcar cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Log user info and redirect if not authenticated
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    // Log user information para debugging
    if (userId && user) {
      console.log('=== CLERK USER INFO ===');
      console.log('User ID:', userId);
      console.log('User Email:', user.emailAddresses?.[0]?.emailAddress);
      console.log('User Name:', user.fullName || `${user.firstName} ${user.lastName}`);
      console.log('User Created:', user.createdAt);
      console.log('======================');
    }
  }, [isLoaded, isSignedIn, userId, user, router]);

  // Show loading while Clerk is loading
  if (!isClient || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-100" />
          <span className="text-zinc-100 text-lg md:text-2xl">
            Verificando autenticación...
          </span>
        </div>
      </div>
    );
  }

  // If not signed in and loaded, don't render anything (redirect is happening)
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-100" />
          <span className="text-zinc-100 text-lg md:text-2xl">
            Redirigiendo al login...
          </span>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}