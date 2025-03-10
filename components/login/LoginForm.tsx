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
    console.log("Formulario enviado:", values);
    
    // Validar el formulario según el modo
    if (!validateForm(values)) {
      return;
    }

    // Verificar que la URL del backend esté definida
    const apiUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:8080';
    console.log("URL del backend:", apiUrl);

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setLoginStatus('idle');

      // Determinar la URL según el modo
      let endpoint = '';
      let payload: any = {};

      if (isLogin) {
        // Modo login
        endpoint = `${apiUrl}/login`;
        payload = {
          email: values.email,
          password: values.password,
        };
      } else if (!isPasswordRecovery) {
        // Modo registro
        endpoint = `${apiUrl}/signup`;
        payload = {
          name: values.name,
          email: values.email,
          password: values.password,
        };
      } else {
        // Modo recuperación de contraseña
        endpoint = `${apiUrl}/recover-password`;
        payload = {
          email: values.email,
        };
      }

      console.log(`Enviando solicitud a ${endpoint}:`, payload);

      // Realizar la petición al servidor
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Respuesta del servidor:", response.status, response.statusText);

      // Intentar obtener la respuesta como JSON
      let data;
      try {
        const responseText = await response.text();
        console.log("Respuesta en texto:", responseText);
        
        try {
          data = JSON.parse(responseText);
          console.log("Datos de respuesta parseados:", data);
        } catch (e) {
          console.error("Error al parsear la respuesta JSON:", e);
          data = { message: responseText };
        }
      } catch (e) {
        console.error("Error al obtener el texto de la respuesta:", e);
        data = {};
      }

      if (!response.ok) {
        // Manejar errores específicos
        if (response.status === 409) {
          throw new Error("El email ya está registrado. Por favor, utiliza otro email o inicia sesión.");
        } else if (response.status === 401) {
          throw new Error("Credenciales incorrectas. Por favor, verifica tu email y contraseña.");
        } else {
          throw new Error(data.message || data.error || "Error en la autenticación");
        }
      }

      // Guardar el token en localStorage y cookie
      if (data.token) {
        console.log("Guardando token:", data.token.substring(0, 10) + "...");
        
        // Guardar el token en una cookie
        document.cookie = `auth_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
        
        // Guardar el nombre de usuario en una cookie
        const userName = data.user?.name || data.name || "Usuario";
        document.cookie = `username=${userName}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
        
        console.log("Cookies establecidas para:", userName);
      }

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
        
        // Llamar a la función de login exitoso si está definida
        const userName = data.user?.name || data.name;
        if (onLoginSuccess && userName) {
          onLoginSuccess(userName);
        }
        
        // Cerrar el diálogo y redirigir después de un breve retraso
        setTimeout(() => {
          // Cerrar el diálogo
          if (dialogCloseRef.current) {
            dialogCloseRef.current.click();
          }
          
          // Redirigir al dashboard
          window.location.href = '/dashboard';
          
          setIsSubmitting(false);
        }, 1000);
      } else {
        // Manejar registro exitoso
        setIsSubmitted(true);
        setTimeout(() => {
          // Cambiar a modo login después del registro exitoso
          setIsLogin(true);
          if (onModeChange) {
            onModeChange(true);
          }
          setIsSubmitted(false);
          setLoginStatus('idle');
          setIsSubmitting(false);
          
          // Limpiar el formulario
          form.reset({
            name: "",
            email: values.email, // Mantener el email para facilitar el login
            password: "",
          });
        }, 2000);
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      setLoginStatus('error');
      setErrorMessage(err instanceof Error ? err.message : "Error desconocido");
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