"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { AddCryptoModal } from "./AddCryptoModal";

export function DashboardContentLogin() {
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

        const minutesRemaining = Math.floor(
          (oneHourInMs - timeElapsed) / 1000 / 60
        );
        console.log(
          `Dashboard - Tiempo restante de sesión: ${minutesRemaining} minutos`
        );
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
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-500 gap-2">
          <span className="text-2xl text-black font-bold ">{userName}</span>{" "}
          Dashboard
        </h1>
        <div className="">
          <AddCryptoModal />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2"></div>
    </div>
  );
}
