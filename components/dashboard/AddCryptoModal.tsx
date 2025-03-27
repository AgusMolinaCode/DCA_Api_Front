"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cryptoFormSchema, type CryptoFormValues } from "@/lib/validation";
import { Plus } from "lucide-react";
import { Crypto, CryptoData } from "@/lib/types";
import FormCryptoAdd from "./FormCryptoAdd";
import { createTransaction } from "@/lib/actions";

// URL base de la API de CryptoCompare
const CRYPTO_COMPARE_API_URL = "https://min-api.cryptocompare.com/data";

// Función para obtener una cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

interface AddCryptoModalProps {
  onAddCrypto?: (data: CryptoData) => void;
}

export function AddCryptoModal({ onAddCrypto }: AddCryptoModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CryptoFormValues>({
    resolver: zodResolver(cryptoFormSchema),
    defaultValues: {
      crypto_name: "",
      ticker: "",
      amount: "",
      purchase_price: "",
      note: "",
      type: "compra",
      image_url: "",
    },
  });

  // Resetear el formulario cuando se abre o cierra el modal
  useEffect(() => {
    if (open) {
      // Si el modal se abre, asegurarse de que todo esté en estado inicial
      handleReset();
    }
  }, [open]);

  // Buscar una criptomoneda por ticker
  const searchCryptoByTicker = async (ticker: string) => {
    if (!ticker || ticker.trim() === "") return;
    
    const formattedTicker = ticker.trim().toUpperCase();
    setIsSearching(true);
    setSearchError(null);
    setManualMode(false);
    
    try {
      // Obtener información detallada de la criptomoneda
      const response = await fetch(
        `${CRYPTO_COMPARE_API_URL}/pricemultifull?fsyms=${formattedTicker}&tsyms=USD`
      );
      
      if (!response.ok) {
        throw new Error("Error al obtener información de la criptomoneda");
      }
      
      const data = await response.json();
      
      if (data.Response === "Error") {
        throw new Error(data.Message || "Criptomoneda no encontrada");
      }
      
      // Verificar si se encontró la criptomoneda
      if (!data.RAW || !data.RAW[formattedTicker] || !data.RAW[formattedTicker].USD) {
        throw new Error(`No se encontró información para ${formattedTicker}`);
      }
      
      const cryptoData = data.RAW[formattedTicker].USD;
      
      // Obtener información adicional (nombre completo, imagen)
      const coinInfoResponse = await fetch(
        `${CRYPTO_COMPARE_API_URL}/coin/generalinfo?fsyms=${formattedTicker}&tsym=USD`
      );
      
      let fullName = formattedTicker;
      let imageUrl = undefined;
      
      if (coinInfoResponse.ok) {
        const coinInfoData = await coinInfoResponse.json();
        if (coinInfoData.Data && coinInfoData.Data.length > 0) {
          const coinInfo = coinInfoData.Data[0].CoinInfo;
          fullName = coinInfo.FullName || formattedTicker;
          imageUrl = coinInfo.ImageUrl ? `https://www.cryptocompare.com${coinInfo.ImageUrl}` : undefined;
        }
      }
      
      // Crear objeto con la información de la criptomoneda
      const crypto: Crypto = {
        name: fullName,
        ticker: formattedTicker,
        price: cryptoData.PRICE,
        imageUrl: imageUrl,
      };
      
      // Actualizar el formulario con la información obtenida
      form.setValue("crypto_name", crypto.name);
      form.setValue("ticker", crypto.ticker);
      form.setValue("purchase_price", crypto.price.toFixed(2));
      form.setValue("image_url", crypto.imageUrl || "");
      
      // Establecer la criptomoneda seleccionada
      setSelectedCrypto(crypto);
      
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Error desconocido.");
      // No limpiar los campos para permitir la entrada manual
      form.setValue("ticker", ticker.trim().toUpperCase());
    } finally {
      setIsSearching(false);
    }
  };

  // Manejar cambios en el ticker
  const handleTickerChange = (value: string) => {
    const ticker = value.trim().toUpperCase();
    form.setValue("ticker", ticker);
  };

  // Buscar información cuando se presiona Enter o se pierde el foco
  const handleTickerSearch = () => {
    const ticker = form.getValues("ticker");
    if (ticker && ticker.trim() !== "") {
      searchCryptoByTicker(ticker);
    }
  };

  // Activar modo manual
  const enableManualMode = () => {
    setManualMode(true);
    setSearchError(null);
    
    // Mantener el ticker pero limpiar los otros campos para entrada manual
    const currentTicker = form.getValues("ticker");
    form.setValue("crypto_name", "");
    form.setValue("purchase_price", "");
    // Establecer la imagen predeterminada para modo manual
    form.setValue("image_url", "/images/cripto.png");
    // Eliminar cualquier error de validación para image_url
    form.clearErrors("image_url");
    
    // Desactivar la selección de criptomoneda
    setSelectedCrypto(null);
  };

  // Resetear el formulario
  const handleReset = () => {
    form.reset({
      crypto_name: "",
      ticker: "",
      amount: "",
      purchase_price: "",
      note: "",
      type: "compra",
      image_url: "",
    });
    setDate(new Date());
    setSelectedCrypto(null);
    setSearchError(null);
    setManualMode(false);
    setIsSubmitting(false);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  // Cancelar y cerrar el modal
  const handleCancel = () => {
    handleReset();
    setOpen(false);
  };

  // Calcular el total cuando cambian amount o purchase_price
  const amount = parseFloat(form.watch("amount") || "0");
  const purchasePrice = parseFloat(form.watch("purchase_price") || "0");
  const total = isNaN(amount) || isNaN(purchasePrice) ? 0 : amount * purchasePrice;

  async function onSubmit(values: CryptoFormValues) {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Verificar que haya un token en las cookies
      const token = getCookie("auth_token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.");
      }
      
      // Si estamos en modo manual, asegurarse de que se use la imagen predeterminada
      if (manualMode) {
        form.setValue("image_url", "/images/cripto.png");
        // Eliminar cualquier error de validación para image_url
        form.clearErrors("image_url");
      }
      
      // Si el usuario ingresó un ticker pero no se ha buscado información y no está en modo manual,
      // intentar buscarla ahora
      if (!selectedCrypto && values.ticker && !manualMode) {
        await searchCryptoByTicker(values.ticker);
      }

      // Usar los valores actualizados después de la búsqueda
      const updatedValues = form.getValues();

      // Si estamos en modo manual, asegurarse de que se use la imagen predeterminada
      if (manualMode) {
        form.setValue("image_url", "/images/cripto.png");
        updatedValues.image_url = "/images/cripto.png";
      }

      // Crear el objeto completo con los valores del formulario
      const cryptoData: CryptoData = {
        crypto_name: updatedValues.crypto_name,
        ticker: updatedValues.ticker,
        amount: parseFloat(updatedValues.amount),
        purchase_price: parseFloat(updatedValues.purchase_price),
        total: parseFloat(updatedValues.amount) * parseFloat(updatedValues.purchase_price),
        date: date.toISOString(),
        added_manually: manualMode,
        image_url: manualMode ? "/images/cripto.png" : (updatedValues.image_url || ""),
        type: updatedValues.type as "compra" | "venta",
        note: updatedValues.note,
      };
      
      // Usar la acción del servidor para crear la transacción
      const result = await createTransaction(cryptoData);
      
      if (!result.success) {
        throw new Error(result.error || "Error al guardar la transacción");
      }
      
      // Llamar al callback si existe
      if (onAddCrypto) {
        onAddCrypto(cryptoData);
      }
      
      // Mostrar mensaje de éxito
      setSubmitSuccess(true);
      
      // Cerrar el modal y resetear el formulario después de un breve retraso
      setTimeout(() => {
        setOpen(false);
        handleReset();
      }, 1500);
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Error al procesar los datos del formulario");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Transacción
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar transacción</DialogTitle>
          <DialogDescription>
            Agrega una transacción de criptomoneda a tu portafolio
          </DialogDescription>
        </DialogHeader>
        
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
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
