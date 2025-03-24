"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TransactionListProps, Transaction } from "@/lib/interface";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
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
  getPaginationRowModel,
} from "@tanstack/react-table";
import { CryptoSearch } from "./CryptoSearch";
import TransactionListModal from "./TransactionListModal";
import EditTransactionModal from "./EditTransactionModal";

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
  const [filteredData, setFilteredData] = useState(transactions);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null);

  // Obtener todas las fechas únicas de las transacciones para habilitar en el calendario
  const transactionDates = transactions.map((t) =>
    new Date(t.transaction.date).setHours(0, 0, 0, 0)
  );
  const uniqueDates = [...new Set(transactionDates)].map(
    (timestamp) => new Date(timestamp)
  );

  // Usar useEffect para actualizar los datos filtrados cuando cambian los filtros
  useEffect(() => {
    let result = transactions;

    // Filtrar por fecha si hay una fecha seleccionada
    if (selectedDate) {
      result = result.filter((item) => {
        const transDate = new Date(item.transaction.date);
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
      result = result.filter(
        (item) =>
          item.transaction.ticker.toLowerCase().includes(searchTermLower) ||
          item.transaction.crypto_name.toLowerCase().includes(searchTermLower)
      );
    }

    setFilteredData(result);
  }, [searchTerm, selectedDate, transactions]);

  // Configurar la tabla
  const table = useReactTable({
    data: filteredData,
    columns: [
      
      {
        accessorKey: "crypto_name",
        header: "Criptomoneda",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <CryptoIcon
              ticker={row.original.transaction.ticker}
              imageUrl={row.original.transaction.image_url}
            />
            <div className="flex justify-between items-center w-[250px]">
              <div className="flex flex-col">
                <span className="font-semibold text-base text-zinc-100">
                  {row.original.transaction.crypto_name}
                </span>
                <span className="text-sm text-zinc-100">
                  {row.original.transaction.ticker}
                </span>
              </div>
              <div
                className={`flex items-center justify-center rounded-full w-6 h-6 mr-6 ${
                  row.original.transaction.type === "compra"
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    row.original.transaction.type === "compra"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {row.original.transaction.type === "compra" ? "C" : "V"}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "date",
        header: ({ column }) => (
          <div className="flex items-center gap-2">
            <span>Fecha</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const isSorted = column.getIsSorted();
                if (isSorted === false) {
                  column.toggleSorting(true); // Ordenar descendente si no está ordenado
                } else {
                  column.toggleSorting(isSorted === "asc"); // Alternar entre asc y desc
                }
              }}
              className="ml-1 h-8 w-8 p-0"
            >
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        ),
        accessorFn: (row) => new Date(row.transaction.date).getTime(),
        cell: ({ row }) => {
          const date = new Date(row.original.transaction.date);
          return (
            <div className="min-w-[120px] text-left">
              <span className="font-medium text-base text-zinc-100">
                {format(date, "dd/MM/yyyy", { locale: es })}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Cantidad",
        cell: ({ row }) => (
          <div className="min-w-[120px] text-left">
            <span className="font-medium text-base text-zinc-100">
              {row.original.transaction.amount} {row.original.transaction.ticker}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "purchase_price",
        header: "Precio",
        cell: ({ row }) => (
          <div className="min-w-[120px] text-left">
            <span className="font-medium text-base text-zinc-100">
              {formatCurrency(row.original.transaction.purchase_price)}
            </span>
          </div>
        ),
      },
      {
        id: "current_price",
        header: "Precio Actual",
        cell: ({ row }) => {
          return (
            <div className="min-w-[120px] text-left">
              <span className="font-medium text-base text-zinc-100">
                {formatCurrency(row.original.current_price)}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
          return (
            <div className="min-w-[120px] text-left">
              <span className="font-bold text-base text-zinc-100">
                {formatCurrency(row.original.transaction.total)}
              </span>
            </div>
          );
        },
      },
      {
        id: "current_value",
        header: "Valor Actual",
        cell: ({ row }) => {
          return (
            <div className="min-w-[120px] text-left">
              <span className="font-bold text-base text-zinc-100">
                {formatCurrency(row.original.current_value)}
              </span>
            </div>
          );
        },
      },
      {
        id: "profit",
        header: ({ column }) => (
          <div className="flex items-center gap-2">
            <span>Ganancia/Pérdida</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const isSorted = column.getIsSorted();
                if (isSorted === false) {
                  column.toggleSorting(true); // Ordenar descendente si no está ordenado
                } else {
                  column.toggleSorting(isSorted === "asc"); // Alternar entre asc y desc
                }
              }}
              className="ml-1 h-8 w-8 p-0"
            >
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        ),
        accessorFn: (row) => row.gain_loss,
        cell: ({ row }) => {
          const isProfit = row.original.gain_loss >= 0;
          return (
            <div className="max-w-[190px] text-left">
              <div className="flex flex-col items-start">
                <span
                  className={`font-bold text-base ${
                    isProfit ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {formatCurrency(row.original.gain_loss)}
                </span>
                <span
                  className={`text-sm ${
                    isProfit ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isProfit ? "+" : ""}
                  {row.original.gain_loss_percent.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, // Mostrar 10 transacciones por página
      },
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  // Establecer el ordenamiento inicial por fecha al cargar el componente
  useEffect(() => {
    setSorting([{
      id: "date",
      desc: true, // Ordenar de más reciente a más antigua
    }]);
  }, []);

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

  // Función para abrir el modal con los detalles de la transacción
  const openTransactionDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  // Función para cerrar el modal
  const closeTransactionDetails = () => {
    setIsDialogOpen(false);
  };

  // Función para manejar la eliminación de una transacción
  const handleTransactionDeleted = () => {
    // Si tenemos una transacción seleccionada
    if (selectedTransaction) {
      // Eliminar la transacción del estado local
      const updatedTransactions = transactions.filter(
        (item) => item.transaction.id !== selectedTransaction.transaction.id
      );
      
      // Aplicar los filtros actuales a las transacciones actualizadas
      let filtered = updatedTransactions;
      
      // Filtrar por fecha si hay una fecha seleccionada
      if (selectedDate) {
        filtered = filtered.filter((item) => {
          const transDate = new Date(item.transaction.date);
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
        filtered = filtered.filter(
          (item) =>
            item.transaction.ticker.toLowerCase().includes(searchTermLower) ||
            item.transaction.crypto_name.toLowerCase().includes(searchTermLower)
        );
      }
      
      // Actualizar el estado filteredData
      setFilteredData(filtered);
      
      // Cerrar el diálogo
      setIsDialogOpen(false);
      
      // Limpiar la transacción seleccionada
      setSelectedTransaction(null);
    }
  };

  // Función para manejar la actualización de una transacción
  const handleTransactionUpdated = () => {
    // Si tenemos una transacción seleccionada para editar
    if (transactionToEdit) {
      // Cerrar el modal de edición
      setIsEditModalOpen(false);
      
      // Actualizar la transacción en el estado local
      const updatedTransactions = [...transactions].map((item) => {
        if (item.transaction.id === transactionToEdit.id) {
          // Actualizar los valores editables (cantidad, precio, tipo, fecha, nota)
          // pero mantener el resto de la información igual
          return {
            ...item,
            transaction: {
              ...item.transaction,
              amount: parseFloat(transactionToEdit.amount),
              purchase_price: parseFloat(transactionToEdit.purchase_price),
              total: parseFloat(transactionToEdit.amount) * parseFloat(transactionToEdit.purchase_price),
              type: transactionToEdit.type,
              date: transactionToEdit.date.toISOString(),
              note: transactionToEdit.note,
            },
          };
        }
        return item;
      });
      
      // Aplicar los filtros actuales a las transacciones actualizadas
      let filtered = updatedTransactions;
      
      // Filtrar por fecha si hay una fecha seleccionada
      if (selectedDate) {
        filtered = filtered.filter((item) => {
          const transDate = new Date(item.transaction.date);
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
        filtered = filtered.filter(
          (item) =>
            item.transaction.ticker.toLowerCase().includes(searchTermLower) ||
            item.transaction.crypto_name.toLowerCase().includes(searchTermLower)
        );
      }
      
      // Actualizar el estado filteredData
      setFilteredData(filtered);
      
      // Limpiar la transacción seleccionada para editar
      setTransactionToEdit(null);
    }
  };

  // Función para manejar la edición de una transacción
  const handleEditTransaction = (transaction: any) => {
    setTransactionToEdit({
      id: transaction.transaction.id,
      crypto_name: transaction.transaction.crypto_name,
      ticker: transaction.transaction.ticker,
      amount: transaction.transaction.amount.toString(),
      purchase_price: transaction.transaction.purchase_price.toString(),
      total: transaction.transaction.total,
      date: new Date(transaction.transaction.date),
      image_url: transaction.transaction.image_url,
      type: transaction.transaction.type,
      note: transaction.transaction.note || "",
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-4 min-h-[900px]">
      <Card className="bg-zinc-800 border-zinc-600">
        <CardHeader className="flex flex-col lg:flex-row items-center justify-between">
          <div>
            <CardTitle className="text-zinc-100">Transacciones</CardTitle>
            <CardDescription className="hidden lg:block text-zinc-200">
              {hasActiveFilters
                ? `Mostrando ${filteredData.length} transacciones${
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
                    disabled={(date) => !isDateAvailable(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
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
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/10"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id}
                          onClick={() => openTransactionDetails(row.original)}
                          className="cursor-pointer"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between space-x-2 py-4 mt-4">
                <div className="text-sm text-zinc-300">
                  Página {table.getState().pagination.pageIndex + 1} de{" "}
                  {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
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

      {/* Modal de detalles de la transacción */}
      <TransactionListModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedTransaction={selectedTransaction}
        onTransactionDeleted={handleTransactionDeleted}
        onEditTransaction={handleEditTransaction}
      />

      {/* Modal de edición de transacción */}
      {transactionToEdit && (
        <EditTransactionModal 
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          transaction={transactionToEdit}
          onTransactionUpdated={handleTransactionUpdated}
        />
      )}
    </div>
  );
}
