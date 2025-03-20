"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

// Función para obtener una cookie
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

export function DashboardContentLogin() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Usuario");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    try {
      // Verificar autenticación
      const token = getCookie("auth_token");
      const storedUserName = getCookie("username");

      if (!token) {
        router.push("/");
        return;
      }

      if (storedUserName) {
        setUserName(storedUserName);
      }

      setIsAuthenticated(true);
    } catch (error) {
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }, [isClient, router]);

  if (!isClient || isLoading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Cargando información del dashboard...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto pb-18">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-zinc-300 gap-2">
          <span className="text-2xl text-zinc-100 font-bold ">{userName}</span>{" "}
        </h1>
        <div className="">
          <AddCryptoModal />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2"></div>
    </div>
  );
}
