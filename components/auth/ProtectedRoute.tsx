"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir si Clerk ya cargó y el usuario no está autenticado
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Mostrar loader mientras Clerk carga
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-100" />
        <span className="ml-1 text-zinc-100 text-lg md:text-2xl">Verificando autenticación...</span>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido
  if (isSignedIn && user) {
    return <>{children}</>;
  }
  
  // Si no está autenticado, no mostrar nada (la redirección ya se habrá iniciado)
  return null;
}