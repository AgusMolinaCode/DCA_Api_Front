import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TransactionListProps } from "@/lib/inteface";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";

export function TransactionList({ transactions }: TransactionListProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Obtener todas las fechas únicas de las transacciones para habilitar en el calendario
  const transactionDates = transactions.map((t) =>
    new Date(t.date).setHours(0, 0, 0, 0)
  );
  const uniqueDates = [...new Set(transactionDates)].map(
    (timestamp) => new Date(timestamp)
  );

  // Función para agrupar transacciones por fecha
  const groupTransactionsByDate = () => {
    // Aplicar filtros (fecha y búsqueda)
    let filteredTransactions = transactions;

    // Filtrar por fecha si hay una fecha seleccionada
    if (selectedDate) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const transDate = new Date(transaction.date);
        return (
          transDate.getDate() === selectedDate.getDate() &&
          transDate.getMonth() === selectedDate.getMonth() &&
          transDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }

    // Filtrar por término de búsqueda (ticker o nombre de criptomoneda)
    if (searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.trim().toLowerCase();
      filteredTransactions = filteredTransactions.filter(
        (transaction) =>
          transaction.ticker.toLowerCase().includes(searchTermLower) ||
          transaction.crypto_name.toLowerCase().includes(searchTermLower)
      );
    }

    const groups: Record<string, typeof transactions> = {};

    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const formattedDate = date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      if (!groups[formattedDate]) {
        groups[formattedDate] = [];
      }

      groups[formattedDate].push(transaction);
    });

    return groups;
  };

  const transactionsByDate = groupTransactionsByDate();
  const sortedDates = Object.keys(transactionsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setSelectedDate(undefined);
    setSearchTerm("");
  };

  // Función para limpiar solo el filtro de fecha
  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  // Función para limpiar solo el filtro de búsqueda
  const clearSearchFilter = () => {
    setSearchTerm("");
  };

  // Función para determinar qué días están disponibles en el calendario
  const isDateAvailable = (date: Date) => {
    return uniqueDates.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );
  };

  // Calcular el número total de transacciones filtradas
  const totalFilteredTransactions = Object.values(transactionsByDate).reduce(
    (acc, transactions) => acc + transactions.length,
    0
  );

  // Determinar si hay filtros activos
  const hasActiveFilters = selectedDate !== undefined || searchTerm.trim() !== "";

  return (
    <div className="space-y-4 min-h-[900px]">
      <Card>
        <CardHeader className="flex flex-col lg:flex-row items-center justify-between">
          <div>
            <CardTitle>Transacciones</CardTitle>
            <CardDescription className="hidden lg:block">
              {hasActiveFilters
                ? `Mostrando ${totalFilteredTransactions} transacciones${selectedDate
                    ? ` del ${format(selectedDate, "d 'de' MMMM yyyy", { locale: es })}`
                    : ""}${searchTerm.trim() !== "" ? ` para "${searchTerm}"` : ""}`
                : `Tienes ${transactions.length} transacciones registradas`}
            </CardDescription>
          </div>
          <div className="flex md:flex-row flex-col items-center gap-2">
            <div className="flex items-center gap-2 relative">
              <Input 
                type="text" 
                placeholder="Buscar por ticker o nombre" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
              {searchTerm ? (
                <button 
                  onClick={clearSearchFilter}
                  className="absolute top-1/2 -translate-y-1/2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <Search className="h-4 w-4 absolute top-1/2 -translate-y-1/2 right-2 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearAllFilters} size="sm">
                  Limpiar todos los filtros
                </Button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    {selectedDate ? format(selectedDate, "d MMM", { locale: es }) : "Filtrar por fecha"}
                    <CalendarIcon className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => !isDateAvailable(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedDates.length > 0 ? (
            <div className="space-y-3">
              {sortedDates.map((date, dateIndex) => (
                <React.Fragment key={date}>
                  {dateIndex > 0 && <Separator className="my-4" />}
                  <div className="mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {date}
                    </h3>
                  </div>
                  {transactionsByDate[date].map((transaction, index) => (
                    <div
                      key={transaction.id || index}
                      className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {transaction.ticker === "USDT" ? (
                            <img
                              src="https://www.cryptocompare.com/media/37746338/usdt.png"
                              alt={transaction.crypto_name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div>
                              {transaction.image_url && (
                                <img
                                  src={transaction.image_url}
                                  alt={transaction.crypto_name}
                                  className="w-10 h-10 rounded-full"
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {transaction.crypto_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">
                            {transaction.type === "compra" ? "+" : "-"}{" "}
                            {transaction.amount} {transaction.ticker}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${transaction.purchase_price.toFixed(2)} USD
                          </p>
                        </div>
                        <div className="flex items-center justify-center rounded-full w-6 h-6 bg-muted">
                          <span className="text-xs font-medium">
                            {transaction.type === "compra" ? "C" : "V"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                {searchTerm.trim() !== "" 
                  ? `No se encontraron transacciones para "${searchTerm}"`
                  : selectedDate 
                    ? "No hay transacciones para la fecha seleccionada."
                    : "No hay transacciones registradas."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
