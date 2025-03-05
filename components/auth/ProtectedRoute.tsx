"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    if (!token || !userName) {
      console.log('Usuario no autenticado, redirigiendo...');
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Mostrar un loader mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verificando autenticación...</span>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
} 