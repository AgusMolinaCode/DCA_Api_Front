"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cryptoFormSchema, type CryptoFormValues } from "@/lib/validation";
import { AlertCircle, CalendarIcon, Loader2, Plus, Search, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Definir la estructura de una criptomoneda
interface Crypto {
  name: string;
  ticker: string;
  price: number;
  imageUrl?: string;
}

// URL base de la API de CryptoCompare
const CRYPTO_COMPARE_API_URL = "https://min-api.cryptocompare.com/data";

interface AddCryptoModalProps {
  onAddCrypto?: (data: any) => void;
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
    },
  });

  // Buscar una criptomoneda por ticker
  const searchCryptoByTicker = async (ticker: string) => {
    if (!ticker || ticker.trim() === "") return;

    const formattedTicker = ticker.trim().toUpperCase();
    setIsSearching(true);
    setSearchError(null);
    setManualMode(false);

    try {
      console.log(`Buscando información para: ${formattedTicker}`);

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
      if (
        !data.RAW ||
        !data.RAW[formattedTicker] ||
        !data.RAW[formattedTicker].USD
      ) {
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
          imageUrl = coinInfo.ImageUrl
            ? `https://www.cryptocompare.com${coinInfo.ImageUrl}`
            : undefined;
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
      form.setValue("purchase_price", crypto.price.toString());

      // Establecer la criptomoneda seleccionada
      setSelectedCrypto(crypto);

      console.log("Información obtenida:", crypto);
    } catch (err) {
      console.error("Error buscando criptomoneda:", err);
      setSearchError(err instanceof Error ? err.message : "Error desconocido");
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

    // Desactivar la selección de criptomoneda
    setSelectedCrypto(null);
  };

  // Calcular el total cuando cambian amount o purchase_price
  const amount = parseFloat(form.watch("amount") || "0");
  const purchasePrice = parseFloat(form.watch("purchase_price") || "0");
  const total =
    isNaN(amount) || isNaN(purchasePrice) ? 0 : amount * purchasePrice;

  async function onSubmit(values: CryptoFormValues) {
    try {
      // Si el usuario ingresó un ticker pero no se ha buscado información y no está en modo manual,
      // intentar buscarla ahora
      if (!selectedCrypto && values.ticker && !manualMode) {
        await searchCryptoByTicker(values.ticker);
      }

      // Usar los valores actualizados después de la búsqueda
      const updatedValues = form.getValues();

      // Crear el objeto completo con los valores del formulario
      const cryptoData = {
        ...updatedValues,
        amount: parseFloat(updatedValues.amount),
        purchase_price: parseFloat(updatedValues.purchase_price),
        total: parseFloat(updatedValues.amount) * parseFloat(updatedValues.purchase_price),
        date: date.toISOString(),
        added_manually: manualMode,
      };

      console.log("Datos de la criptomoneda:", cryptoData);
      
      // Enviar los datos a la API
      setIsSubmitting(true);
      
      try {
        const response = await fetch('http://localhost:8080/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(cryptoData),
        });
        
        if (!response.ok) {
          throw new Error(`Error al guardar la transacción: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log("Transacción guardada exitosamente:", responseData);
        
        // Llamar al callback si existe
        if (onAddCrypto) {
          onAddCrypto(cryptoData);
        }
        
        // Mostrar mensaje de éxito
        setSubmitSuccess(true);
        
        // Cerrar el modal y resetear el formulario después de un breve retraso
        setTimeout(() => {
          setOpen(false);
          form.reset();
          setDate(new Date());
          setSelectedCrypto(null);
          setSearchError(null);
          setManualMode(false);
          setSubmitSuccess(false);
        }, 1500);
        
      } catch (apiError) {
        console.error("Error al enviar datos a la API:", apiError);
        setSubmitError(apiError instanceof Error ? apiError.message : "Error al guardar la transacción");
        setIsSubmitting(false);
      }
      
    } catch (error) {
      console.error("Error al agregar criptomoneda:", error);
      setSubmitError("Error al procesar los datos del formulario");
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Agregar cripto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar cripto</DialogTitle>
          <DialogDescription>
            Agrega una cripto a tu lista de criptos
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo de búsqueda por ticker */}
            <div className="mb-4">
              <FormField
                control={form.control}
                name="ticker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buscar por ticker</FormLabel>
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
                          disabled={manualMode}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={handleTickerSearch}
                        disabled={isSearching || !field.value || manualMode}
                      >
                        {isSearching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormDescription>
                      Ingresa el ticker de la criptomoneda (ej: BTC para
                      Bitcoin)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mensaje de error y opción para agregar manualmente */}
              {searchError && !manualMode && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex justify-between items-center">
                    <span>
                      No se encontró información para esta criptomoneda
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={enableManualMode}
                    >
                      Agregar manualmente
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Indicador de modo manual */}
              {manualMode && (
                <Alert className="mt-2 bg-yellow-50 text-yellow-800 border-yellow-200">
                  <AlertDescription>
                    Modo manual activado. Ingresa los datos de la criptomoneda.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Información de la criptomoneda */}
            {selectedCrypto && (
              <div className="bg-muted p-4 rounded-md mb-4">
                <div className="flex items-center mb-2">
                  {selectedCrypto.imageUrl && (
                    <img
                      src={selectedCrypto.imageUrl}
                      alt={selectedCrypto.name}
                      className="w-8 h-8 mr-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{selectedCrypto.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedCrypto.ticker}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <p className="font-medium">
                      ${selectedCrypto.price.toFixed(2)} USD
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="crypto_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bitcoin"
                        {...field}
                        readOnly={!!selectedCrypto && !manualMode}
                      />
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
                    <FormLabel>Precio de compra (USD)</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="50000.00"
                          {...field}
                          readOnly={!!selectedCrypto && !manualMode}
                        />
                      </FormControl>
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="compra">Compra</SelectItem>
                        <SelectItem value="venta">Venta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel>Fecha</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nota</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Agrega una nota sobre esta transacción"
                        className="resize-none h-[38px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">${total.toFixed(2)} USD</span>
              </div>
            </div>
            
            {/* Mensaje de éxito o error */}
            {submitSuccess && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Transacción guardada exitosamente
                </AlertDescription>
              </Alert>
            )}
            
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  {submitError}
                </AlertDescription>
              </Alert>
            )}
            
            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  setDate(new Date());
                  setSelectedCrypto(null);
                  setSearchError(null);
                  setManualMode(false);
                }}
                className="hover:bg-gray-200"
              >
                Resetear
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Agregar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
