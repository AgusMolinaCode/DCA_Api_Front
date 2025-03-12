"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./login/LoginForm";

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

export const Navbar = () => {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Marcar cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Verificar el estado de autenticación
  function checkAuthStatus() {
    if (typeof window !== 'undefined') {
      // Obtener el token de las cookies
      const token = getCookie('auth_token');
      const storedUserName = getCookie('username');
      
      if (token && storedUserName) {
        setIsAuthenticated(true);
        setUserName(storedUserName);
      } else {
        setIsAuthenticated(false);
        setUserName("");
      }
    }
  }

  // Verificar el estado de autenticación al cargar la página
  useEffect(() => {
    if (!isClient) return;

    // Verificar al cargar la página
    checkAuthStatus();

    // Configurar un intervalo para verificar la expiración cada minuto
    const checkInterval = setInterval(() => {
      checkAuthStatus();
    }, 60000); // Verificar cada minuto

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(checkInterval);
  }, [isClient]);

  // Función para cambiar entre modos de login y registro
  const handleModeChange = (isLogin: boolean) => {
    setIsLoginMode(isLogin);
    setIsPasswordRecovery(false);
  };

  // Función para manejar el modo de recuperación de contraseña
  const handlePasswordRecoveryMode = (isRecovery: boolean) => {
    setIsPasswordRecovery(isRecovery);
  };

  // Función para manejar el inicio de sesión exitoso
  const handleLoginSuccess = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
  };

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Obtener el token de las cookies
      const token = getCookie('auth_token');
      
      if (!token) {
        return;
      }
      
      // Verificar que la URL del backend esté definida
      const apiUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:8080';
      if (!apiUrl) {
        // Limpiar datos de sesión de todos modos
        deleteCookie("auth_token");
        deleteCookie("username");
        setIsAuthenticated(false);
        setUserName("");
        window.location.href = "/";
        return;
      }
      
      // Llamar al endpoint de logout
      const response = await fetch(`${apiUrl}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      // Eliminar las cookies
      deleteCookie("auth_token");
      deleteCookie("username");
      
      // Actualizar el estado de autenticación
      setIsAuthenticated(false);
      setUserName("");
      
      // Redirigir a la página principal
      window.location.href = "/";
    } catch (error) {   
      
      // Limpiar datos de sesión de todos modos en caso de error
      deleteCookie("auth_token");
      deleteCookie("username");
      setIsAuthenticated(false);
      setUserName("");
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex justify-around items-center p-4">
      <div className="flex items-center justify-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">DCA-app</h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {isClient && isAuthenticated ? (
          <div className="flex items-center space-x-4"> 
            <Button onClick={handleLogout} variant="destructive">
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Acceder</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center">
                  {isPasswordRecovery
                    ? "Recuperar contraseña"
                    : isLoginMode
                    ? "Iniciar sesión"
                    : "Crear cuenta"}
                </DialogTitle>
                <DialogDescription className="text-center text-sm">
                  {isPasswordRecovery
                    ? "Ingresa tu correo electrónico para recuperar tu contraseña"
                    : isLoginMode
                    ? "Ingresa tus credenciales para acceder"
                    : "Completa el formulario para registrarte"}
                </DialogDescription>
              </DialogHeader>
              <LoginForm
                onModeChange={handleModeChange}
                onPasswordRecoveryMode={handlePasswordRecoveryMode}
                onLoginSuccess={handleLoginSuccess}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
