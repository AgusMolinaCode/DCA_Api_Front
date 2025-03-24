"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cryptoFormSchema, type CryptoFormValues } from "@/lib/validation";
import { Crypto, CryptoData } from "@/lib/interface";
import FormCryptoAdd from "./FormCryptoAdd";
import { editTransaction } from "@/lib/actions";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: any;
  onTransactionUpdated?: () => void;
}

export default function EditTransactionModal({
  open,
  onOpenChange,
  transaction,
  onTransactionUpdated,
}: EditTransactionModalProps) {
  const [date, setDate] = useState<Date>(
    transaction?.date ? new Date(transaction.date) : new Date()
  );
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [manualMode, setManualMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm<CryptoFormValues>({
    resolver: zodResolver(cryptoFormSchema),
    defaultValues: {
      crypto_name: transaction?.crypto_name || "",
      ticker: transaction?.ticker || "",
      amount: transaction?.amount || "",
      purchase_price: transaction?.purchase_price || "",
      note: transaction?.note || "",
      type: transaction?.type || "compra",
      image_url: transaction?.image_url || "/images/cripto.png",
    },
  });

  // Actualizar el formulario cuando cambia la transacción
  useEffect(() => {
    if (transaction && open) {
      form.reset({
        crypto_name: transaction.crypto_name || "",
        ticker: transaction.ticker || "",
        amount: transaction.amount || "",
        purchase_price: transaction.purchase_price || "",
        note: transaction.note || "",
        type: transaction.type || "compra",
        image_url: transaction.image_url || "/images/cripto.png",
      });
      
      setDate(transaction.date ? new Date(transaction.date) : new Date());
      setManualMode(true);
      setSubmitSuccess(false);
      setSubmitError(null);
    }
  }, [transaction, open, form]);

  // Función vacía ya que no necesitamos buscar en modo edición
  const handleTickerChange = (value: string) => {
    // No permitimos cambiar el ticker en modo edición
  };

  const handleTickerSearch = () => {
    // No hacemos nada en modo edición
  };

  const enableManualMode = () => {
    // Siempre en modo manual pero con campos bloqueados
    setManualMode(true);
  };

  const handleReset = () => {
    if (transaction) {
      form.reset({
        crypto_name: transaction.crypto_name || "",
        ticker: transaction.ticker || "",
        amount: transaction.amount || "",
        purchase_price: transaction.purchase_price || "",
        note: transaction.note || "",
        type: transaction.type || "compra",
        image_url: transaction.image_url || "/images/cripto.png",
      });
      
      setDate(transaction.date ? new Date(transaction.date) : new Date());
    }
    
    setSelectedCrypto(null);
    setSearchError(null);
    setManualMode(true);
    setIsSubmitting(false);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  // Calcular el total cuando cambian amount o purchase_price
  const amount = parseFloat(form.watch("amount") || "0");
  const purchasePrice = parseFloat(form.watch("purchase_price") || "0");
  const total = isNaN(amount) || isNaN(purchasePrice) ? 0 : amount * purchasePrice;

  async function onSubmit(values: CryptoFormValues) {
    if (!transaction?.id) {
      setSubmitError("No se encontró el ID de la transacción");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Crear el objeto completo con los valores del formulario
      const cryptoData: CryptoData = {
        // Mantener los valores originales para estos campos
        crypto_name: transaction.crypto_name,
        ticker: transaction.ticker,
        // Usar siempre la imagen original de la transacción
        image_url: transaction.image_url || "/images/cripto.png",
        // Campos editables
        amount: parseFloat(values.amount),
        purchase_price: parseFloat(values.purchase_price),
        total: parseFloat(values.amount) * parseFloat(values.purchase_price),
        date: date.toISOString(),
        added_manually: true,
        type: values.type as "compra" | "venta",
        note: values.note,
      };
      
      // Usar la acción del servidor para editar la transacción
      const result = await editTransaction(transaction.id, cryptoData);
      
      if (!result.success) {
        throw new Error(result.error || "Error al actualizar la transacción");
      }
      
      // Actualizar el objeto transaction con los nuevos valores
      if (transaction) {
        transaction.amount = cryptoData.amount;
        transaction.purchase_price = cryptoData.purchase_price;
        transaction.total = cryptoData.total;
        transaction.type = cryptoData.type;
        transaction.date = new Date(cryptoData.date);
        transaction.note = cryptoData.note;
      }
      
      // Mostrar mensaje de éxito
      setSubmitSuccess(true);
      
      // Cerrar el modal y notificar la actualización después de un breve retraso
      setTimeout(() => {
        onOpenChange(false);
        
        // Notificar que la transacción fue actualizada
        if (onTransactionUpdated) {
          onTransactionUpdated();
        }
      }, 1500);
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Error al procesar los datos del formulario");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar transacción</DialogTitle>
          <DialogDescription>
            Modifica los detalles de la transacción
          </DialogDescription>
        </DialogHeader>
        
        {submitError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
        
        <FormCryptoAdd 
          form={form}
          onSubmit={onSubmit}
          selectedCrypto={selectedCrypto}
          manualMode={manualMode}
          date={date}
          setDate={setDate}
          total={total}
          submitSuccess={submitSuccess}
          submitError={submitError}
          isSubmitting={isSubmitting}
          handleTickerChange={handleTickerChange}
          handleTickerSearch={handleTickerSearch}
          isSearching={isSearching}
          enableManualMode={enableManualMode}
          searchError={searchError}
          onReset={handleReset}
          isEditMode={true} // Indicar que estamos en modo edición
        />
      </DialogContent>
    </Dialog>
  );
}