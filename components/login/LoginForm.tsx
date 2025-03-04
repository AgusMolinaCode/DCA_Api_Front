"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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
import { DialogClose } from "@/components/ui/dialog"

// Esquema unificado para ambos formularios
const formSchema = z.object({
  name: z.string().optional(),
  email: z.string(),
  password: z.string(),
})

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onModeChange?: (isLogin: boolean) => void;
}

export function LoginForm({ onModeChange }: LoginFormProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (onModeChange) {
      onModeChange(isLogin);
    }
  }, [isLogin, onModeChange]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      // Determinar la URL según el modo (login o signup)
      const url = isLogin 
        ? `${process.env.NEXT_PUBLIC_URL}/login` 
        : `${process.env.NEXT_PUBLIC_URL}/signup`;
      
      // Preparar los datos para enviar
      const payload = isLogin ? {
        email: values.email,
        password: values.password
      } : {
        name: values.name,
        email: values.email,
        password: values.password
      };

      console.log("Enviando datos:", payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log("✅ Operación exitosa");
        setLoginStatus('success');
        const data = await response.json();
        console.log("Respuesta del servidor:", data);

        // Si es login exitoso, redirigir después de mostrar el mensaje
        if (isLogin) {
          setIsSubmitted(true);
          setTimeout(() => {
            // Cerrar el diálogo
            if (dialogCloseRef.current) {
              dialogCloseRef.current.click();
            }
            
            // Redirigir al dashboard con el nombre de usuario
            router.push(`/dashboard?name=${encodeURIComponent(data.user.name)}`);
          }, 1000); // Redirigir después de 1 segundo para que se vea el mensaje de éxito
        } else {
          // Para registro, mostrar mensaje de éxito y cambiar a modo login
          setIsSubmitted(true);
          setTimeout(() => {
            setIsSubmitted(false);
            setLoginStatus('idle');
            setIsLogin(true); // Cambiar a modo login después del registro
          }, 1000);
        }
      } else {
        console.error("❌ Error en la operación");
        const error = await response.text();
        console.error("Error del servidor:", error);
        setLoginStatus('error');
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setLoginStatus('idle');
        }, 1000);
      }

    } catch (error) {
      console.error("Error de conexión:", error);
      setLoginStatus('error');
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setLoginStatus('idle');
      }, 1000);
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setLoginStatus('idle');
    setIsSubmitted(false);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex flex-col space-y-2">
          {isSubmitted ? (
            <div className={`flex items-center justify-center gap-2 p-2 rounded-md ${
              loginStatus === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {loginStatus === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span>
                {loginStatus === 'success' 
                  ? (isLogin ? "¡Inicio de sesión exitoso!" : "¡Registro exitoso!")
                  : (isLogin ? "Error en el inicio de sesión" : "Error en el registro")}
              </span>
            </div>
          ) : (
            <Button type="submit" className="w-full">
              {isLogin ? "Iniciar sesión" : "Registrarse"}
            </Button>
          )}
          
          <div className="text-center text-sm mt-2">
            <span className="text-muted-foreground">
              {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
            </span>{" "}
            <button 
              type="button" 
              onClick={toggleMode} 
              className="text-primary underline hover:text-primary/90 italic"
            >
              {isLogin ? "Registrarse" : "Iniciar sesión"}
            </button>
          </div>
        </div>

        {/* Botón oculto para cerrar el diálogo */}
        <DialogClose ref={dialogCloseRef} className="hidden" />
      </form>
    </Form>
  )
}

export default LoginForm;