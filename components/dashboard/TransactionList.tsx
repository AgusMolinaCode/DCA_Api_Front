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
import { CalendarIcon, Search, X, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TokenIcon } from "@web3icons/react";
import Image from "next/image";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const CryptoIcon = ({
  ticker,
  imageUrl,
}: {
  ticker: string;
  imageUrl?: string;
}) => {
  return (
    <div className="relative w-8 h-8">
      <TokenIcon
        name={ticker.toUpperCase()}
        fallback={
          <Image
            src={imageUrl || "/images/cripto.png"}
            alt={ticker}
            width={32}
            height={32}
            className="object-contain"
          />
        }
      />
    </div>
  );
};

export function TransactionList({ transactions }: TransactionListProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);

  // Obtener todas las fechas únicas de las transacciones para habilitar en el calendario
  const transactionDates = transactions.map((t) =>
    new Date(t.date).setHours(0, 0, 0, 0)
  );
  const uniqueDates = [...new Set(transactionDates)].map(
    (timestamp) => new Date(timestamp)
  );

  // Función para aplicar filtros (fecha y búsqueda)
  const getFilteredTransactions = () => {
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

    return filteredTransactions;
  };

  const filteredTransactions = getFilteredTransactions();

  // Agrupar transacciones por fecha
  const groupTransactionsByDate = (
    transactions: typeof filteredTransactions
  ) => {
    const groups: Record<string, typeof filteredTransactions> = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const formattedDate = format(date, "d 'de' MMMM yyyy", { locale: es });

      if (!groups[formattedDate]) {
        groups[formattedDate] = [];
      }

      groups[formattedDate].push(transaction);
    });

    return groups;
  };

  const transactionsByDate = groupTransactionsByDate(filteredTransactions);
  const sortedDates = Object.keys(transactionsByDate).sort((a, b) => {
    // Ordenar fechas de más reciente a más antigua
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

  // Determinar si hay filtros activos
  const hasActiveFilters =
    selectedDate !== undefined || searchTerm.trim() !== "";

  // Función para renderizar el encabezado de columna con botón de ordenamiento
  const renderSortableHeader = (column: any, title: string) => {
    // Si la columna no está ordenada, establecer el orden descendente por defecto
    const toggleSorting = () => {
      const isSorted = column.getIsSorted();
      if (isSorted === false) {
        column.toggleSorting(true); // Ordenar descendente si no está ordenado
      } else {
        column.toggleSorting(isSorted === "asc"); // Alternar entre asc y desc
      }
    };

    return (
      <div className="flex items-center justify-end gap-2">
        <span>{title}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSorting}
          className="ml-1 h-8 w-8 p-0"
        >
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  };

  // Definir las columnas para la tabla
  const columns: ColumnDef<(typeof transactions)[0]>[] = [
    {
      accessorKey: "crypto_name",
      header: "Criptomoneda",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CryptoIcon
            ticker={row.original.ticker}
            imageUrl={row.original.image_url}
          />
          <div className="flex justify-between w-[250px]">
            <div className="flex flex-col">
              <span className="font-semibold text-base text-zinc-100">
                {row.original.crypto_name}
              </span>
              <span className="text-sm text-zinc-100">{row.original.ticker}</span>
            </div>
            <div className={`flex items-center justify-center rounded-full w-6 h-6 ml-6 ${row.original.type === "compra" ? "bg-green-500/20" : "bg-red-500/20"}`}>
              <span className={`text-xs font-medium ${row.original.type === "compra" ? "text-green-500" : "text-red-500"}`}>
                {row.original.type === "compra" ? "C" : "V"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Hora",
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        const formattedTime = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });
        return (
          <div className="min-w-[80px]">
            <span className="font-medium text-base text-zinc-100">
              {formattedTime}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => renderSortableHeader(column, "Cantidad"),
      cell: ({ row }) => (
        <div className="min-w-[120px] text-right">
          <span className="font-medium text-base text-zinc-100">
            {row.original.amount} {row.original.ticker}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "purchase_price",
      header: ({ column }) => renderSortableHeader(column, "Precio"),
      cell: ({ row }) => (
        <div className="min-w-[120px] text-right">
          <span className="font-medium text-base text-zinc-100">
            {formatCurrency(row.original.purchase_price)}
          </span>
        </div>
      ),
    },
    {
      id: "current_price",
      header: ({ column }) => renderSortableHeader(column, "Precio Actual"),
      cell: ({ row }) => {
        // Aquí necesitaríamos el precio actual de la criptomoneda
        // Como no tenemos ese dato, mostramos un placeholder
        return (
          <div className="min-w-[120px] text-right">
            <span className="font-medium text-base text-zinc-400">
              No disponible
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => renderSortableHeader(column, "Total"),
      cell: ({ row }) => {
        const total = row.original.amount * row.original.purchase_price;
        return (
          <div className="min-w-[120px] text-right">
            <span className="font-bold text-base text-zinc-100">
              {formatCurrency(total)}
            </span>
          </div>
        );
      },
    },
    {
      id: "profit",
      header: ({ column }) => renderSortableHeader(column, "Profit"),
      cell: ({ row }) => {
        // Aquí necesitaríamos el precio actual para calcular el profit
        // Como no tenemos ese dato en las transacciones, podemos mostrar un placeholder
        // o calcular un profit estimado si tuviéramos acceso a precios actuales
        return (
          <div className="min-w-[120px] text-right">
            <span className="font-medium text-base text-zinc-400">
              No disponible
            </span>
          </div>
        );
      },
    },
  ];

  // Configurar la tabla
  const table = useReactTable({
    data: filteredTransactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-4 min-h-[900px]">
      <Card className="bg-zinc-800 border-zinc-600">
        <CardHeader className="flex flex-col lg:flex-row items-center justify-between">
          <div>
            <CardTitle className="text-zinc-100">Transacciones</CardTitle>
            <CardDescription className="hidden lg:block text-zinc-200">
              {hasActiveFilters
                ? `Mostrando ${filteredTransactions.length} transacciones${
                    selectedDate
                      ? ` del ${format(selectedDate, "d 'de' MMMM yyyy", {
                          locale: es,
                        })}`
                      : ""
                  }${searchTerm.trim() !== "" ? ` para "${searchTerm}"` : ""}`
                : `Tienes ${transactions.length} transacciones registradas`}
            </CardDescription>
          </div>
          <div className="flex md:flex-row flex-col items-center gap-2">
            <div className="flex items-center gap-2 relative">
              <Input
                type="text"
                placeholder="Buscar criptomonedas"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8 text-zinc-100"
              />
              {searchTerm ? (
                <button
                  onClick={clearSearchFilter}
                  className="absolute top-1/2 -translate-y-1/2 right-2  hover:bg-muted/10 text-zinc-100 transition-colors"
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
                    disabled={(date) => !isDateAvailable(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {sortedDates.map((date, dateIndex) => (
                <div key={date} className="rounded-md overflow-hidden">
                  <div className="mb-2 px-3">
                    <h3 className="text-md font-medium text-zinc-200">
                      {date}
                    </h3>
                  </div>
                  <Table>
                    {dateIndex === 0 && (
                      <TableHeader>
                        <TableRow>
                          {table.getHeaderGroups().map((headerGroup) =>
                            headerGroup.headers.map((header) => (
                              <TableHead
                                className="text-zinc-200"
                                key={header.id}
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            ))
                          )}
                        </TableRow>
                      </TableHeader>
                    )}
                    <TableBody>
                      {transactionsByDate[date].map((transaction) => {
                        // Crear una fila para cada transacción
                        const row = table
                          .getRowModel()
                          .rows.find((r) => r.original.id === transaction.id);

                        if (!row) return null;

                        return (
                          <TableRow
                            key={transaction.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="hover:bg-muted/10 text-zinc-200"
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {dateIndex < sortedDates.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-zinc-300">
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
