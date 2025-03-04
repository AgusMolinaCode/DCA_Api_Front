"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Función para cambiar entre modos de login y registro
  const handleModeChange = (isLogin: boolean) => {
    setIsLoginMode(isLogin);
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="">Acceder</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">
                {isLoginMode ? "Iniciar sesión" : "Crear cuenta"}
              </DialogTitle>
              <DialogDescription className="text-center text-sm">
                {isLoginMode
                  ? "Ingresa tus credenciales para acceder"
                  : "Completa el formulario para registrarte"}
              </DialogDescription>
              <div className="text-center text-xs text-muted-foreground mt-1">
                <span>Los datos se mostrarán en la consola. </span>
                <button 
                  type="button" 
                  onClick={() => console.log("Abre la consola del navegador con F12 o Cmd+Option+I")}
                  className="text-primary underline hover:text-primary/90 italic"
                >
                  Ver instrucciones
                </button>
              </div>
            </DialogHeader>
            <LoginForm onModeChange={handleModeChange} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
