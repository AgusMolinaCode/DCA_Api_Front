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
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Marcar cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (!isClient) return;

    function verifyAuth() {
      try {  
        // Verificar si hay un token y su tiempo de expiración
        const token = localStorage.getItem('token');
        const userName = localStorage.getItem('userName');
        const loginTime = localStorage.getItem('loginTime');
        

        // Si no hay token o nombre de usuario, no está autenticado
        if (!token || !userName || !loginTime) {
          setIsAuthenticated(false);
          setIsLoading(false);
          router.push('/');
          return;
        }
        
        // Verificar si ha pasado más de 1 hora desde el inicio de sesión
        const currentTime = new Date().getTime();
        const loginTimeMs = parseInt(loginTime);
        const oneHourInMs = 60 * 60 * 1000; // 1 hora en milisegundos
        const timeElapsed = currentTime - loginTimeMs;
        

        if (timeElapsed > oneHourInMs) {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('loginTime');
          
          setIsAuthenticated(false);
          setIsLoading(false);
          router.push('/');
          return;
        }
        
        // Si el token existe y no ha expirado, establecer como autenticado
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    }

    // Verificar inmediatamente
    verifyAuth();
    
    // Configurar un intervalo para verificar la expiración cada minuto
    const checkInterval = setInterval(() => {
      verifyAuth();
    }, 60000); // Verificar cada minuto
    
    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(checkInterval);
  }, [router, isClient]);

  // Mostrar un loader mientras se verifica la autenticación (solo en el cliente)
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verificando autenticación...</span>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  // Si no está autenticado y ya terminó de cargar, no mostrar nada
  // La redirección ya se habrá iniciado en el useEffect
  return null;
} 