"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect } from "react"
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

// Esquema para el formulario de registro (incluye todos los campos posibles)
const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }).optional(),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onModeChange?: (isLogin: boolean) => void;
}

export function LoginForm({ onModeChange }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Notificar al componente padre cuando cambia el modo
  useEffect(() => {
    if (onModeChange) {
      onModeChange(isLogin);
    }
  }, [isLogin, onModeChange]);
  
  // Definir el formulario
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  // Manejar el envío del formulario
  async function onSubmit(values: FormValues) {
    try {
      // Determinar la URL de la solicitud
      const url = `${process.env.NEXT_PUBLIC_URL}/login`;
      
      // Preparar los datos para enviar
      const payload = {
        email: values.email,
        password: values.password
      };

      // Realizar la solicitud de login
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // Verificar la respuesta
      if (response.ok) {
        console.log("✅ Login exitoso");
        setLoginStatus('success');
      } else {
        console.error("❌ Error en el login");
        setLoginStatus('error');
      }

      // Mostrar mensaje de éxito o error
      setIsSubmitted(true);
      
      // Resetear el estado después de 3 segundos
      setTimeout(() => {
        setIsSubmitted(false);
        setLoginStatus('idle');
      }, 3000);

    } catch (error) {
      console.error("Error de conexión:", error);
      setLoginStatus('error');
      setIsSubmitted(true);
    }
  }

  // Cambiar entre login y registro
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setLoginStatus('idle');
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo de nombre (solo para registro) */}
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
        
        {/* Campo de email */}
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
        
        {/* Campo de contraseña */}
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
                  ? "¡Inicio de sesión exitoso!" 
                  : "Error en el inicio de sesión"}
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
      </form>
    </Form>
  )
}

export default LoginForm;