"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Función para obtener una cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

// Función para eliminar una cookie
function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
}

// Función para verificar si la sesión ha expirado
function hasSessionExpired(): boolean {
  if (typeof document === 'undefined') return true;
  
  const sessionExpiration = getCookie('session_expiration');
  if (!sessionExpiration) return true;
  
  return new Date().getTime() > parseInt(sessionExpiration);
}

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
        // Verificar si hay un token en las cookies
        const token = getCookie('auth_token');
        const userName = getCookie('username');

        // Si no hay token o nombre de usuario, no está autenticado
        if (!token || !userName) {
          setIsAuthenticated(false);
          setIsLoading(false);
          router.push('/');
          return;
        }
        
        // Verificar si la sesión ha expirado
        if (hasSessionExpired()) {
          console.log("La sesión ha expirado después de 5 horas");
          // Cerrar sesión automáticamente
          deleteCookie("auth_token");
          deleteCookie("username");
          deleteCookie("session_expiration");
          setIsAuthenticated(false);
          setIsLoading(false);
          router.push('/');
          return;
        }
        
        // Si el token existe y la sesión no ha expirado, establecer como autenticado
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push('/');
      }
    }

    // Verificar inmediatamente
    verifyAuth();
    
    // Configurar un intervalo para verificar la expiración cada 5 segundos
    const checkInterval = setInterval(() => {
      verifyAuth();
    }, 5000); // Verificar cada 5 segundos
    
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