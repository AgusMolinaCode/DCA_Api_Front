"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle } from "lucide-react"
import { resetPasswordSchema } from "@/lib/validation"


type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Verificar que hay un token en la URL
  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token no válido o expirado. Por favor solicita un nuevo enlace de recuperación.');
    }
  }, [token]);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) {
      setStatus('error');
      setMessage('Token no válido o expirado. Por favor solicita un nuevo enlace de recuperación.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          password: values.password,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Contraseña restablecida con éxito. Serás redirigido al inicio de sesión.');
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        const errorData = await response.text();
        console.error('Error al restablecer la contraseña:', errorData);
        setStatus('error');
        setMessage('Error al restablecer la contraseña. El token puede haber expirado.');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setStatus('error');
      setMessage('Error de conexión. Por favor intenta de nuevo.');
    }
  }

  return (
    <div className="container mx-auto max-w-md p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Restablecer contraseña</h1>
        
        {status === 'idle' && token ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full mt-4">
                Restablecer contraseña
              </Button>
            </form>
          </Form>
        ) : (
          <div className={`flex items-center justify-center gap-2 p-4 rounded-md ${
            status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span>{message}</span>
          </div>
        )}
        
        <div className="text-center mt-4">
          <Button 
            variant="link" 
            onClick={() => router.push('/')}
            className="text-sm"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
} 