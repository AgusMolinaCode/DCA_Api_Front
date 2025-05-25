"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DashboardItem } from "@/lib/interface";
import { createTransaction, deleteTransactionsByTicker } from "@/lib/actions";
import { TokenIcon } from "@web3icons/react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, CheckCircle, Loader2, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sellCryptoSchema, type SellCryptoFormValues } from "@/lib/validation";

interface SellCryptoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crypto: DashboardItem | null;
  onTransactionComplete?: () => void;
}

export function SellCryptoModal({ 
  open, 
  onOpenChange, 
  crypto, 
  onTransactionComplete 
}: SellCryptoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [iconError, setIconError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const form = useForm<SellCryptoFormValues>({
    resolver: zodResolver(sellCryptoSchema),
    defaultValues: {
      amount: "",
      sell_price: "",
      note: "",
      add_to_wallet: false,
    },
  });
  
  // Calcular el total basado en la cantidad y el precio de venta
  const amount = parseFloat(form.watch("amount") || "0");
  const sellPrice = parseFloat(form.watch("sell_price") || "0");
  const total = isNaN(amount) || isNaN(sellPrice) ? 0 : amount * sellPrice;
  
  // Resetear el formulario cuando se abre o cierra el modal
  useEffect(() => {
    if (open && crypto) {
      // Asegurarse de que todos los valores estén definidos correctamente
      form.reset({
        amount: "",
        sell_price: crypto.current_price.toFixed(2),
        note: "",
        add_to_wallet: false,
      });
      setSubmitSuccess(false);
      setSubmitError(null);
      setIsSubmitting(false);
      setIconError(false);
    }
  }, [open, form, crypto]);
  
  // Validar que la cantidad a vender no exceda las tenencias
  useEffect(() => {
    if (crypto && amount > crypto.holdings) {
      form.setError("amount", { 
        type: "manual", 
        message: `No puedes vender más de ${crypto.holdings} ${crypto.ticker}` 
      });
    } else {
      form.clearErrors("amount");
    }
  }, [amount, crypto, form]);

  async function onSubmit(values: SellCryptoFormValues) {
    if (!crypto) return;
    
    // Establecer isSubmitting a true inmediatamente para bloquear el botón
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      
      // Crear objeto de transacción de venta
      const sellTransaction = {
        crypto_name: crypto.crypto_name,
        ticker: crypto.ticker,
        amount: parseFloat(values.amount),
        purchase_price: parseFloat(values.sell_price),
        total: total,
        date: new Date().toISOString(),
        note: values.note || "",
        type: "venta" as const,
        added_manually: false,
        image_url: crypto.image_url,
      };
      
      // Enviar la transacción al servidor
      const response = await createTransaction(sellTransaction);
      
      // Si el usuario eligió agregar USDT a la cartera, crear una transacción de compra de USDT
      if (values.add_to_wallet) {
        const usdtTransaction = {
          crypto_name: "USDT",
          ticker: "USDT",
          amount: total, // El total de la venta en USD
          purchase_price: 1, // 1 USDT = 1 USD
          total: total,
          date: new Date().toISOString(),
          note: `USDT recibidos por venta de ${crypto.ticker}`,
          type: "compra" as const,
          added_manually: false,
          image_url: "https://www.cryptocompare.com/media/37746338/usdt.png", // Imagen de USDT
        };
        
        // Enviar la transacción de USDT al servidor
        const usdtResponse = await createTransaction(usdtTransaction);
        
        if (!usdtResponse.success) {
          console.warn("Error al registrar USDT en cartera:", usdtResponse.error);
          // No interrumpir el flujo principal si falla la adición de USDT
        }
      }
      
      if (!response.success) {
        throw new Error(response.error || "Error al registrar la venta");
      }
      
      setSubmitSuccess(true);
      
      // Esperar 1.5 segundos y cerrar el modal
      // Mantener isSubmitting en true hasta que se cierre el modal
      setTimeout(() => {
        // Resetear el estado solo cuando se cierra el modal
        setIsSubmitting(false);
        onOpenChange(false);
        if (onTransactionComplete) {
          onTransactionComplete();
        }
      }, 1500);
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Error al procesar la venta");
      // Solo desactivar isSubmitting si hay un error
      setIsSubmitting(false);
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  async function handleConfirmDelete() {
    if (!crypto) return;
    
    try {
      setIsDeleting(true);
      setSubmitError(null);
      
      // Eliminar todas las transacciones del ticker
      const response = await deleteTransactionsByTicker(crypto.ticker);
      
      if (!response.success) {
        throw new Error(response.error || "Error al eliminar las transacciones");
      }
      
      setSubmitSuccess(true);
      setShowDeleteConfirm(false);
      
      // Esperar 1.5 segundos y cerrar el modal
      setTimeout(() => {
        onOpenChange(false);
        if (onTransactionComplete) {
          onTransactionComplete();
        }
      }, 1500);
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Error al eliminar las transacciones");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }
  
  const handleCancel = () => {
    onOpenChange(false);
  };
  
  if (!crypto) return null;
  
  return (
    <>
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar todas las transacciones?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará permanentemente todas las transacciones asociadas a {crypto.crypto_name} ({crypto.ticker}). 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose onClick={handleCancelDelete}>Cancelar</DialogClose>
            <Button 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Vender {crypto.crypto_name}</DialogTitle>
            <DialogDescription>
              Ingresa la cantidad y el precio de venta que deseas
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-4 rounded-md mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                {!iconError ? (
                  <TokenIcon
                    name={crypto.ticker.toUpperCase()}
                    onError={() => setIconError(true)}
                    fallback={
                      <Image
                        src={crypto.image_url || "/images/cripto.png"}
                        alt={crypto.ticker}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    }
                  />
                ) : (
                  <Image
                    src={crypto.image_url || "/images/cripto.png"}
                    alt={crypto.ticker}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                )}
              </div>
              <div>
                <h3 className="font-medium">{crypto.crypto_name}</h3>
                <p className="text-sm text-muted-foreground">{crypto.ticker}</p>
              </div>
              <div className="ml-auto">
                <p className="font-medium">${crypto.current_price.toFixed(3)} USD</p>
                <p className="text-sm text-muted-foreground">
                  Tenencias: {crypto.holdings} {crypto.ticker}
                </p>
              </div>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad a vender</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.00000001"
                          placeholder={`0.0 (max: ${crypto.holdings.toFixed(3)})`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sell_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio de venta</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.001"
                          placeholder="0.000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <FormLabel className="text-sm pb-1">Total a recibir</FormLabel>
                <div className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  ${total.toFixed(3)}
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="add_to_wallet"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Agregar USDT a cartera</FormLabel>
                      <FormDescription>
                        Registrar los USDT obtenidos de la venta en tu cartera
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="add-to-wallet"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={field.value === true}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                          }}
                        />
                        <label htmlFor="add-to-wallet" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Activar
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nota (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Agrega una nota sobre esta venta"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {submitSuccess && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    {isDeleting ? "Transacciones eliminadas correctamente" : "Venta registrada correctamente"}
                  </AlertDescription>
                </Alert>
              )}
              
              {submitError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-between space-x-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteClick}
                  disabled={isSubmitting || isDeleting}
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar Todo
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting || isDeleting}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isDeleting || crypto.holdings <= 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      "Vender"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}