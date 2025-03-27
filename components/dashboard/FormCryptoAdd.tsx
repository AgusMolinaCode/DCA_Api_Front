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
import { Crypto, CryptoData } from "@/lib/interface";

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
  onCancel?: () => void; // Nueva propiedad opcional para cancelar y cerrar el modal
  isEditMode?: boolean;
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
  onCancel,
  isEditMode,
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
          {/* Mostrar el campo de ticker solo si NO estamos en modo edición */}
          {!isEditMode ? (
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
                    Ingresa el ticker de la criptomoneda (ej: BTC para Bitcoin,
                    ETH para Ethereum, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            /* Campo oculto para el ticker en modo edición */
            <input
              type="hidden"
              {...form.register("ticker")}
              value={form.getValues("ticker")}
            />
          )}

          {searchError && !manualMode && !isEditMode && (
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

          {manualMode && !isEditMode && (
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

        {/* En modo edición, mostrar un resumen de la criptomoneda en lugar del campo de nombre */}
        {isEditMode ? (
          <div>
            <div className="bg-muted p-4 rounded-md mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <img
                    src={form.getValues("image_url") || "/images/cripto.png"}
                    alt={form.getValues("crypto_name")}
                    className="w-8 h-8"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/cripto.png";
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium">
                    {form.getValues("crypto_name")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {form.getValues("ticker")}
                  </p>
                </div>
                <div className="ml-auto">
                  <p className="text-sm text-muted-foreground">
                    Tipo:{" "}
                    {form.getValues("type") === "compra" ? "Compra" : "Venta"}
                  </p>
                </div>
              </div>
            </div>
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
        ) : (
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
                      readOnly={(!!selectedCrypto && !manualMode) || isEditMode}
                      disabled={isEditMode}
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
        )}

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

        <div>
          {/* Campo oculto para la URL de la imagen */}
          <input
            type="hidden"
            {...form.register("image_url")}
            value={
              selectedCrypto && !manualMode
                ? selectedCrypto?.imageUrl
                : "/images/cripto.png"
            }
          />

          {/* Campo oculto para el tipo - Siempre establecido como "compra" */}
          <input
            type="hidden"
            {...form.register("type")}
            value={isEditMode ? form.getValues("type") : "compra"}
          />

          {/* Campo oculto para el nombre en modo edición */}
          {isEditMode && (
            <input
              type="hidden"
              {...form.register("crypto_name")}
              value={form.getValues("crypto_name")}
            />
          )}

          <div className="grid gap-4 pb-4">
            <div>
              <FormLabel className="text-sm pb-1">Fecha</FormLabel>
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
                <FormLabel>Nota (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Agrega una nota sobre esta transacción"
                    className="resize-none"
                    {...field}
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
            <AlertDescription>
              {isEditMode
                ? "Transacción actualizada correctamente"
                : "Transacción agregada correctamente"}
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
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Actualizando..." : "Guardando..."}
              </>
            ) : isEditMode ? (
              "Actualizar"
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default FormCryptoAdd;
