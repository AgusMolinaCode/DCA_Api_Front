"use client";

import React, { useState, useEffect } from "react";
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
  const [userName, setUserName] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Marcar cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Verificar el estado de autenticación al cargar la página
  useEffect(() => {
    if (!isClient) return;

    function checkAuthStatus() {
      try {
   
        const token = localStorage.getItem("token");
        const userName = localStorage.getItem("userName");
        const loginTime = localStorage.getItem("loginTime");



        // Si no hay información de autenticación, no está autenticado
        if (!token || !userName || !loginTime) {
       
          setIsAuthenticated(false);
          setUserName("");
          return;
        }

        // Verificar si ha pasado más de 1 hora desde el inicio de sesión
        const currentTime = new Date().getTime();
        const loginTimeMs = parseInt(loginTime);
        const oneHourInMs = 60 * 60 * 1000; // 1 hora en milisegundos
        const timeElapsed = currentTime - loginTimeMs;

    

        if (timeElapsed > oneHourInMs) {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          localStorage.removeItem("loginTime");

          setIsAuthenticated(false);
          setUserName("");
          return;
        }

        setIsAuthenticated(true);
        setUserName(userName);
      } catch (error) {
        setIsAuthenticated(false);
        setUserName("");
      }
    }

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

  // Función para manejar el login exitoso
  const handleLoginSuccess = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    if (isClient) {
      localStorage.setItem("userName", name);
    }
  };

  // Función para manejar el logout
  const handleLogout = async () => {
    if (!isClient) return;

    try {
      // Obtener el token almacenado
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");

      // Verificar si hay token y nombre de usuario
      if (!token || !userName) {
        setIsAuthenticated(false);
        setUserName("");
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("loginTime");
        router.push("/");
        return;
      }

      // Verificar que la URL del backend esté definida
      const backendUrl = process.env.NEXT_PUBLIC_URL;
      if (!backendUrl) {
       
        setIsAuthenticated(false);
        setUserName("");
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("loginTime");
        router.push("/");
        return;
      }


      // Intentar hacer la solicitud con un timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

      try {
        const response = await fetch(`${backendUrl}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
         
          // Limpiar el estado de autenticación
          setIsAuthenticated(false);
          setUserName("");

          // Eliminar datos del almacenamiento local
          localStorage.removeItem("userName");
          localStorage.removeItem("token");
          localStorage.removeItem("loginTime");

          // Redirigir a la página de inicio
          router.push("/");
        } else {
          const errorData = await response.text();
         

          // En caso de error, igual limpiar el estado
          setIsAuthenticated(false);
          setUserName("");
          localStorage.removeItem("userName");
          localStorage.removeItem("token");
          localStorage.removeItem("loginTime");
          router.push("/");
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);

        // Si hay un error de conexión, limpiar el estado de todos modos
        setIsAuthenticated(false);
        setUserName("");
        localStorage.removeItem("userName");
        localStorage.removeItem("token");
        localStorage.removeItem("loginTime");
        router.push("/");
      }
    } catch (error) {
     

      // En caso de error de conexión, limpiar el estado
      setIsAuthenticated(false);
      setUserName("");
      localStorage.removeItem("userName");
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
      router.push("/");
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
