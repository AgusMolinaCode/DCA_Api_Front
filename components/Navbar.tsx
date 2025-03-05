"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./login/LoginForm";

export const Navbar = () => {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  // Verificar el estado de autenticación al cargar la página
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedToken = localStorage.getItem('token');
    
    if (storedUserName && storedToken) {
      setIsAuthenticated(true);
      setUserName(storedUserName);
    } else {
      // Limpiar cualquier estado de autenticación inconsistente
      setIsAuthenticated(false);
      setUserName('');
      localStorage.removeItem('userName');
      localStorage.removeItem('token');
    }
  }, []);

  // Función para cambiar entre modos de login y registro
  const handleModeChange = (isLogin: boolean) => {
    setIsLoginMode(isLogin);
    setIsPasswordRecovery(false);
  };

  // Función para manejar el modo de recuperación de contraseña
  const handlePasswordRecoveryMode = (isRecovery: boolean) => {
    setIsPasswordRecovery(isRecovery);
  };

  // Función para manejar el login exitoso
  const handleLoginSuccess = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    localStorage.setItem('userName', name);
  };

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      // Obtener el token almacenado
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('userName');

      // Verificar si hay token y nombre de usuario
      if (!token || !userName) {
        console.error('No hay token o nombre de usuario');
        
        // Resetear el estado de autenticación
        setIsAuthenticated(false);
        setUserName('');
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        router.push('/');
        return;
      }

      // Verificar que la URL del backend esté definida
      const backendUrl = process.env.NEXT_PUBLIC_URL;
      if (!backendUrl) {
        console.error('La URL del backend no está definida en las variables de entorno');
        // Limpiar el estado de autenticación de todos modos
        setIsAuthenticated(false);
        setUserName('');
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        router.push('/');
        return;
      }

      console.log(`Intentando cerrar sesión en: ${backendUrl}/logout`);
      
      // Intentar hacer la solicitud con un timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
      
      try {
        const response = await fetch(`${backendUrl}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          console.log('Logout exitoso');
          // Limpiar el estado de autenticación
          setIsAuthenticated(false);
          setUserName('');
          
          // Eliminar datos del almacenamiento local
          localStorage.removeItem('userName');
          localStorage.removeItem('token');
          
          // Redirigir a la página de inicio
          router.push('/');
        } else {
          const errorData = await response.text();
          console.error('Error al cerrar sesión:', errorData);
          
          // En caso de error, igual limpiar el estado
          setIsAuthenticated(false);
          setUserName('');
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          router.push('/');
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('Error en la solicitud fetch:', fetchError);
        
        // Si hay un error de conexión, limpiar el estado de todos modos
        setIsAuthenticated(false);
        setUserName('');
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        router.push('/');
      }
    } catch (error) {
      console.error('Error general:', error);
      
      // En caso de error de conexión, limpiar el estado
      setIsAuthenticated(false);
      setUserName('');
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      router.push('/');
    }
  };

  return (
    <div className="flex justify-around items-center p-4">
      <div className="flex items-center justify-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <h1 className="text-2xl font-bold">Logo</h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm">Hola, {userName}</span>
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
                    : (isLoginMode ? "Iniciar sesión" : "Crear cuenta")}
                </DialogTitle>
                <DialogDescription className="text-center text-sm">
                  {isPasswordRecovery
                    ? "Ingresa tu correo electrónico para recuperar tu contraseña"
                    : (isLoginMode
                      ? "Ingresa tus credenciales para acceder"
                      : "Completa el formulario para registrarte")}
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
