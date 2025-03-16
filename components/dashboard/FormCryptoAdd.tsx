"use client";

import React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Loader2, Search, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CryptoFormValues } from "@/lib/validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Crypto, CryptoData } from "@/lib/inteface";

interface FormCryptoAddProps {
  form: UseFormReturn<CryptoFormValues>;
  onSubmit: (values: CryptoFormValues) => void;
  selectedCrypto: Crypto | null;
  manualMode: boolean;
  date: Date;
  setDate: (date: Date) => void;
  total: number;
  submitSuccess: boolean;
  submitError: string | null;
  isSubmitting: boolean;
  handleTickerChange: (value: string) => void;
  handleTickerSearch: () => void;
  isSearching: boolean;
  enableManualMode: () => void;
  searchError: string | null;
  onReset: () => void;
}

const FormCryptoAdd = ({
  form,
  onSubmit,
  selectedCrypto,
  manualMode,
  date,
  setDate,
  total,
  submitSuccess,
  submitError,
  isSubmitting,
  handleTickerChange,
  handleTickerSearch,
  isSearching,
  enableManualMode,
  searchError,
  onReset,
}: FormCryptoAddProps) => {
  React.useEffect(() => {
    if (manualMode) {
      form.setValue("image_url", "/images/cripto.png");
      form.clearErrors("image_url");
    }
  }, [manualMode, form]);

  const handleFormSubmit = form.handleSubmit((values) => {
    if (manualMode) {
      values.image_url = "/images/cripto.png";
    }
    onSubmit(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
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
                  Ingresa el ticker de la criptomoneda (ej: BTC para Bitcoin, ETH para Ethereum, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {searchError && !manualMode && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex justify-between items-center">
                <span>No se encontró la criptomoneda</span>
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

          {manualMode && (
            <Alert className="mt-2 bg-yellow-50 text-yellow-800 border-yellow-200">
              <AlertDescription>
                Modo manual activado. Ingresa los datos de la criptomoneda.
              </AlertDescription>
            </Alert>
          )}
        </div>

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
                <FormLabel>Precio de compra</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="0.00 USD"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                          field.onChange(value);
                        } else {
                          field.onChange(value);
                        }
                      } else {
                        field.onChange("");
                      }
                    }}
                  />
                </FormControl>
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
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    <SelectItem value="compra">Compra</SelectItem>
                    <SelectItem value="venta">Venta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          {/* Campo oculto para la URL de la imagen */}
          <input 
            type="hidden" 
            {...form.register("image_url")} 
            value={manualMode ? "/images/cripto.png" : (selectedCrypto?.imageUrl || "")} 
          />

          <div className="grid gap-4">
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
                    className="resize-none h-[48px]"
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
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Guardar"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={isSubmitting}
          >
            Limpiar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormCryptoAdd;
