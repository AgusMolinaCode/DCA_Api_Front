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

// Esquema flexible que funciona para todos los modos
const flexibleSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof flexibleSchema>;

interface LoginFormProps {
  onModeChange?: (isLogin: boolean) => void;
  onPasswordRecoveryMode?: (isRecovery: boolean) => void;
  onLoginSuccess?: (name: string) => void;
}

export function LoginForm({ 
  onModeChange, 
  onPasswordRecoveryMode,
  onLoginSuccess
}: LoginFormProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (onModeChange) {
      onModeChange(isLogin);
    }
    if (onPasswordRecoveryMode) {
      onPasswordRecoveryMode(isPasswordRecovery);
    }
  }, [isLogin, isPasswordRecovery, onModeChange, onPasswordRecoveryMode]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(flexibleSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Validación manual adicional antes de enviar
  const validateForm = (values: FormValues): boolean => {
    let isValid = true;
    
    // Limpiar errores previos
    form.clearErrors();
    
    // Validar según el modo
    if (!isPasswordRecovery) {
      if (values.password === undefined || values.password.trim() === "") {
        form.setError("password", { 
          type: "manual", 
          message: "La contraseña es requerida" 
        });
        isValid = false;
      }
      
      if (!isLogin && (!values.name || values.name.trim() === "")) {
        form.setError("name", { 
          type: "manual", 
          message: "El nombre es requerido" 
        });
        isValid = false;
      }
    }
    
    return isValid;
  };

  async function onSubmit(values: FormValues) {
    // Validación manual adicional
    if (!validateForm(values)) {
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage("");
    console.log("Iniciando envío del formulario:", { isLogin, isPasswordRecovery, values });
    
    try {
      // Determinar la URL según el modo (login, signup o recuperación de contraseña)
      let url = '';
      let payload = {};

      if (isPasswordRecovery) {
        url = `${process.env.NEXT_PUBLIC_URL}/request-reset-password`;
        payload = {
          email: values.email
        };
      } else {
        url = isLogin 
          ? `${process.env.NEXT_PUBLIC_URL}/login` 
          : `${process.env.NEXT_PUBLIC_URL}/signup`;
        
        payload = isLogin ? {
          email: values.email,
          password: values.password
        } : {
          name: values.name,
          email: values.email,
          password: values.password
        };
      }

      console.log(`Enviando solicitud a: ${url}`, payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include', // Importante para manejar cookies
      });

      console.log("Respuesta recibida:", { status: response.status, ok: response.ok });

      if (response.ok) {
        setLoginStatus('success');
        const data = await response.json();
        console.log("Datos de respuesta:", data);

        if (isPasswordRecovery) {
          // Manejar recuperación de contraseña
          setIsSubmitted(true);
          setTimeout(() => {
            setIsSubmitted(false);
            setLoginStatus('idle');
            setIsPasswordRecovery(false);
            setIsSubmitting(false);
          }, 2000);
        } else if (isLogin) {
          // Manejar login
          setIsSubmitted(true);
          
          // Guardar el token y el tiempo de inicio de sesión inmediatamente
          if (isClient && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('loginTime', new Date().getTime().toString());
            
            // Guardar el nombre de usuario
            if (data.user && data.user.name) {
              localStorage.setItem('userName', data.user.name);
            }
          }
          
          // Llamar a la función de login exitoso si está definida
          if (onLoginSuccess && data.user && data.user.name) {
            onLoginSuccess(data.user.name);
          }
          
          console.log("Login exitoso, redirigiendo al dashboard...");
          
          // Cerrar el diálogo y redirigir después de un breve retraso
          setTimeout(() => {
            // Cerrar el diálogo
            if (dialogCloseRef.current) {
              dialogCloseRef.current.click();
            }
            
            // Redirigir al dashboard
            window.location.href = '/dashboard';
          }, 500);
        } else {
          // Manejar registro
          setIsSubmitted(true);
          setTimeout(() => {
            setIsSubmitted(false);
            setLoginStatus('idle');
            setIsLogin(true);
            setIsSubmitting(false);
          }, 1000);
        }
      } else {
        // Manejar errores de respuesta
        let errorText = "";
        try {
          const errorData = await response.json();
          errorText = errorData.message || errorData.error || "Error en la operación";
          console.error("Error de respuesta (JSON):", errorData);
        } catch (e) {
          // Si no es JSON, intentar obtener el texto
          errorText = await response.text();
          console.error("Error de respuesta (texto):", errorText);
        }
        
        setErrorMessage(errorText);
        setLoginStatus('error');
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setLoginStatus('idle');
          setIsSubmitting(false);
        }, 3000);
      }

    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorMessage("Error de conexión. Por favor, intenta de nuevo más tarde.");
      setLoginStatus('error');
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setLoginStatus('idle');
        setIsSubmitting(false);
      }, 3000);
    }
  }

  const toggleMode = () => {
    if (isPasswordRecovery) {
      setIsPasswordRecovery(false);
      setIsLogin(true);
    } else {
      setIsLogin(!isLogin);
    }
    setLoginStatus('idle');
    setIsSubmitted(false);
    setErrorMessage("");
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo de nombre (solo para registro) */}
        {!isLogin && !isPasswordRecovery && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Tu nombre" 
                    {...field} 
                    disabled={isSubmitting}
                  />
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
              <FormLabel>{isPasswordRecovery ? "Email para recuperación" : "Email"}</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder={isSubmitting ? "Enviando..." : "tu@email.com"} 
                  {...field} 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Campo de contraseña (solo para login y registro) */}
        {!isPasswordRecovery && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder={isSubmitting ? "Iniciando..." : "******"} 
                    {...field} 
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
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
                  ? (isPasswordRecovery 
                    ? "Solicitud de recuperación enviada" 
                    : (isLogin ? "¡Inicio de sesión exitoso!" : "¡Registro exitoso!"))
                  : errorMessage || (isLogin ? "Error en el inicio de sesión" : "Error en el registro")}
              </span>
            </div>
          ) : (
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (isPasswordRecovery 
                  ? "Enviando..." 
                  : (isLogin ? "Iniciando..." : "Registrando..."))
                : (isPasswordRecovery 
                  ? "Enviar solicitud de recuperación" 
                  : (isLogin ? "Iniciar sesión" : "Registrarse"))}
            </Button>
          )}
          
          <div className="text-center text-sm mt-2">
            {!isPasswordRecovery ? (
              <>
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
                {isLogin && (
                  <>
                    {" • "}
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsPasswordRecovery(true);
                        form.reset();
                      }}
                      className="text-primary underline hover:text-primary/90 italic"
                    >
                      Recuperar contraseña
                    </button>
                  </>
                )}
              </>
            ) : (
              <button 
                type="button" 
                onClick={toggleMode} 
                className="text-primary underline hover:text-primary/90 italic"
              >
                Volver a iniciar sesión
              </button>
            )}
          </div>
        </div>

        {/* Botón oculto para cerrar el diálogo */}
        <DialogClose ref={dialogCloseRef} className="hidden" />
      </form>
    </Form>
  )
}

export default LoginForm;