// components/dashboard/TransactionFilters.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CryptoSearch } from "./CryptoSearch";

interface TransactionFiltersProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearAllFilters: () => void;
  clearDateFilter: () => void;
  clearSearchFilter: () => void;
  hasActiveFilters: boolean;
  uniqueDates: Date[];
  transactionsCount: number;
  filteredCount: number;
}

// Función para determinar qué días están disponibles en el calendario
const isDateAvailable = (date: Date, uniqueDates: Date[]) => {
  return uniqueDates.some(
    (d) =>
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
  );
};

export const TransactionFilters = ({
  selectedDate,
  setSelectedDate,
  searchTerm,
  setSearchTerm,
  clearAllFilters,
  clearSearchFilter,
  hasActiveFilters,
  uniqueDates,
  transactionsCount,
  filteredCount,
}: TransactionFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full p-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-100">Transacciones</h2>
        <p className="hidden lg:block text-sm text-zinc-200">
          {hasActiveFilters
            ? `Mostrando ${filteredCount} transacciones${
                selectedDate
                  ? ` del ${format(selectedDate, "d 'de' MMMM yyyy", {
                      locale: es,
                    })}`
                  : ""
              }${searchTerm.trim() !== "" ? ` para "${searchTerm}"` : ""}`
            : `Tienes ${transactionsCount} transacciones registradas`}
        </p>
      </div>
      <div className="flex md:flex-row flex-col items-center gap-2">
        <CryptoSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          clearSearchFilter={clearSearchFilter}
        />
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearAllFilters} size="sm">
              Limpiar filtros
            </Button>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {selectedDate
                  ? format(selectedDate, "d MMM", { locale: es })
                  : "Filtrar por fecha"}
                <CalendarIcon className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => !isDateAvailable(date, uniqueDates)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
