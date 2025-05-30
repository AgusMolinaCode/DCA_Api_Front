"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, CheckCircle, AlertCircle, Search } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bolsa } from "@/lib/interface";

// Esquema de validación para agregar una criptomoneda a una bolsa
const addCryptoBolsaSchema = z.object({
  crypto_name: z.string().min(1, "El nombre de la criptomoneda es requerido"),
  ticker: z.string().min(1, "El ticker es requerido").toUpperCase(),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, "La cantidad debe ser mayor a 0"),
  purchase_price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, "El precio debe ser mayor a 0"),
});

type AddCryptoBolsaFormValues = z.infer<typeof addCryptoBolsaSchema>;

interface AddCryptoBolsaModalProps {
  bolsa: Bolsa | null;
  isOpen: boolean;
  onClose: () => void;
  onAddCrypto?: (data: { bolsa_id: string; crypto_name: string; ticker: string; amount: number; purchase_price: number; total: number }) => void;
}

export default function AddCryptoBolsaModal({
  bolsa,
  isOpen,
  onClose,
  onAddCrypto
}: AddCryptoBolsaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Inicializar el formulario con valores por defecto
  const form = useForm<AddCryptoBolsaFormValues>({
    resolver: zodResolver(addCryptoBolsaSchema),
    defaultValues: {
      crypto_name: "",
      ticker: "",
      amount: "",
      purchase_price: "",
    },
  });

  // Resetear el formulario
  const handleReset = () => {
    form.reset({
      crypto_name: "",
      ticker: "",
      amount: "",
      purchase_price: "",
    });
    setSubmitSuccess(false);
    setSubmitError(null);
    setSearchError(null);
  };

  // Cancelar y cerrar el modal
  const handleCancel = () => {
    handleReset();
    onClose();
  };

  // Manejar cambios en el ticker
  const handleTickerChange = (value: string) => {
    const ticker = value.trim().toUpperCase();
    form.setValue("ticker", ticker);
  };

  // Buscar información de la criptomoneda cuando se presiona Enter o se pierde el foco
  const handleTickerSearch = async () => {
    const ticker = form.getValues("ticker");
    if (!ticker || ticker.trim() === "") return;
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      // Aquí iría la lógica para buscar la criptomoneda
      // Por ahora solo simularemos una respuesta exitosa
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simular que encontramos la criptomoneda
      if (ticker === "SOL") {
        form.setValue("crypto_name", "Solana");
        form.setValue("purchase_price", "200");
      } else if (ticker === "BTC") {
        form.setValue("crypto_name", "Bitcoin");
        form.setValue("purchase_price", "60000");
      } else if (ticker === "ETH") {
        form.setValue("crypto_name", "Ethereum");
        form.setValue("purchase_price", "3000");
      } else {
        throw new Error(`No se encontró información para ${ticker}`);
      }
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "Error desconocido al buscar la criptomoneda");
    } finally {
      setIsSearching(false);
    }
  };

  // Calcular el total cuando cambian amount o purchase_price
  const amount = parseFloat(form.watch("amount") || "0");
  const purchasePrice = parseFloat(form.watch("purchase_price") || "0");
  const total = isNaN(amount) || isNaN(purchasePrice) ? 0 : amount * purchasePrice;

  // Manejar el envío del formulario
  const onSubmit = async (values: AddCryptoBolsaFormValues) => {
    if (!bolsa) return;
    
    try {
      // Deshabilitar el botón inmediatamente
      setIsSubmitting(true);
      setSubmitError(null);

      // Crear el objeto de datos de la criptomoneda
      const cryptoData = {
        bolsa_id: bolsa.id,
        crypto_name: values.crypto_name,
        ticker: values.ticker,
        amount: parseFloat(values.amount),
        purchase_price: parseFloat(values.purchase_price),
        total: parseFloat(values.amount) * parseFloat(values.purchase_price)
      };
      
      // Solo mostrar por consola el resultado
      console.log("Criptomoneda agregada a la bolsa:", cryptoData);

      // Llamar al callback si existe
      if (onAddCrypto) {
        onAddCrypto(cryptoData);
      }

      // Mostrar mensaje de éxito
      setSubmitSuccess(true);
      
      // Solo resetear el formulario, pero no cerrar el modal
      handleReset();
      
      // Cerrar este modal pero no el modal de detalles
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Error al procesar los datos del formulario"
      );
    } finally {
      // Siempre habilitamos el botón al finalizar
      setIsSubmitting(false);
    }
  };

  if (!bolsa) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar criptomoneda a {bolsa.name}</DialogTitle>
          <DialogDescription>
            Agrega una nueva criptomoneda a tu bolsa de inversión
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticker</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input
                        placeholder="BTC, ETH, SOL..."
                        {...field}
                        onChange={(e) => {
                          handleTickerChange(e.target.value);
                        }}
                        onBlur={handleTickerSearch}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleTickerSearch();
                          }
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={handleTickerSearch}
                      disabled={isSearching || !field.value}
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormDescription>
                    Ingresa el ticker de la criptomoneda (ej: BTC para Bitcoin,
                    ETH para Ethereum, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {searchError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {searchError}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="crypto_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Bitcoin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.00000001"
                        placeholder="0.5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchase_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de compra</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="20000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-sm pb-1">Total</FormLabel>
                <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  ${total.toFixed(2)}
                </div>
              </div>
            </div>
            
            {submitSuccess && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Criptomoneda agregada correctamente
                </AlertDescription>
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