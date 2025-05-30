"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { bolsaFormSchema, type BolsaFormValues } from "@/lib/validation";
import { createBolsa } from "@/lib/actions";

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

interface AddBolsaModalProps {
  onAddBolsa?: (data: BolsaFormValues) => void;
}

export default function AddBolsaModal({ onAddBolsa }: AddBolsaModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Inicializar el formulario con valores por defecto
  const form = useForm<BolsaFormValues>({
    resolver: zodResolver(bolsaFormSchema),
    defaultValues: {
      name: "",
      description: "",
      goal: undefined,
    },
  });

  // Resetear el formulario cuando se abre o cierra el modal
  const handleReset = () => {
    form.reset({
      name: "",
      description: "",
      goal: undefined,
    });
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  // Cancelar y cerrar el modal
  const handleCancel = () => {
    handleReset();
    setOpen(false);
  };

  // Manejar el envío del formulario
  const onSubmit = async (values: BolsaFormValues) => {
    try {
      // Deshabilitar el botón inmediatamente
      setIsSubmitting(true);
      setSubmitError(null);

      // Llamar a la función createBolsa para crear la bolsa en el servidor
      const result = await createBolsa({
        name: values.name,
        description: values.description,
        goal: values.goal as number
      });

      // Verificar si la operación fue exitosa
      if (!result.success) {
        throw new Error(result.error || "Error al crear la bolsa de inversión");
      }

      // Llamar al callback si existe
      if (onAddBolsa) {
        onAddBolsa(values);
      }

      // Mostrar mensaje de éxito
      setSubmitSuccess(true);
      
      // Cerrar el modal y resetear el formulario
      setOpen(false);
      handleReset();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Error al procesar los datos del formulario"
      );
      // Habilitar el botón en caso de error para permitir reintentar
      setIsSubmitting(false);
    } finally {
      // Siempre habilitamos el botón al finalizar, ya sea con éxito o error
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Agregar bolsa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar nueva bolsa</DialogTitle>
          <DialogDescription>
            Crea una nueva bolsa de inversión
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la bolsa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mi bolsa de criptomonedas"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe el propósito de esta bolsa"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo de inversión</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100000"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {submitSuccess && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Bolsa creada correctamente</AlertDescription>
              </Alert>
            )}

            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
