"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function DashboardContent() {
  const [userName, setUserName] = useState<string>("Usuario");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    try {
      // Obtener el nombre de usuario desde localStorage
      const storedUserName = localStorage.getItem("userName");
      console.log("Dashboard - Nombre de usuario:", storedUserName);

      if (storedUserName) {
        setUserName(storedUserName);
      }

      // Verificar si el token existe y no ha expirado
      const token = localStorage.getItem("token");
      const loginTime = localStorage.getItem("loginTime");

      if (!token || !loginTime) {
        console.warn("Dashboard - No hay token o tiempo de login");
      } else {
        // Verificar si ha pasado más de 1 hora desde el inicio de sesión
        const currentTime = new Date().getTime();
        const loginTimeMs = parseInt(loginTime);
        const oneHourInMs = 60 * 60 * 1000; // 1 hora en milisegundos
        const timeElapsed = currentTime - loginTimeMs;
        
        const minutesRemaining = Math.floor((oneHourInMs - timeElapsed) / 1000 / 60);
        console.log(`Dashboard - Tiempo restante de sesión: ${minutesRemaining} minutos`);
      }
    } catch (error) {
      console.error("Error al obtener datos de usuario:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isClient]);

  if (!isClient || isLoading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Cargando información del dashboard...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido</CardTitle>
            <CardDescription>Información de usuario</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-medium">¡Hola, {userName}!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Has iniciado sesión correctamente. Tu sesión expirará después de 1 hora de inactividad.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Estado de la sesión</CardTitle>
            <CardDescription>Información sobre tu sesión actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Usuario:</span> {userName}
              </p>
              <p className="text-sm">
                <span className="font-medium">Estado:</span>{" "}
                <span className="text-green-600 font-medium">Activo</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Recuerda cerrar sesión cuando termines de usar la aplicación.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 