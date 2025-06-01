"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateBolsa } from "@/lib/actions";
import { Bolsa } from "@/lib/interface";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EditIcon } from "lucide-react";

// Esquema de validación para el formulario
const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  goal: z.coerce
    .number()
    .min(1, "El objetivo debe ser mayor que 0")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditBolsaModalProps {
  bolsa: Bolsa;
  onSuccess?: () => void;
  isButtonVisible?: boolean;
}

export default function EditBolsaModal({ 
  bolsa, 
  onSuccess,
  isButtonVisible = true
}: EditBolsaModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Inicializar el formulario con los valores actuales de la bolsa
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: bolsa.name,
      description: bolsa.description || "",
      goal: bolsa.goal,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const result = await updateBolsa(bolsa.id.toString(), data);

      if (result.success) {
        setSubmitSuccess(true);
        setOpen(false);
        
        // Llamar al callback onSuccess si existe
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setSubmitError(result.error || "Error al actualizar la bolsa");
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Error al procesar los datos del formulario"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isButtonVisible && (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
          onClick={() => setOpen(true)}
        >
          <EditIcon className="h-4 w-4 mr-1" />
          Editar
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar bolsa de inversión</DialogTitle>
            <DialogDescription>
              Actualiza los detalles de tu bolsa de inversión
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {submitError}
                </div>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la bolsa" {...field} />
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
                    <FormLabel>Objetivo (ARS)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Monto objetivo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
