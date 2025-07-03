"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionListProps } from "@/lib/interface";

import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Search,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
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
import { CryptoIcon } from "./CryptoIcon";
import { formatCurrency } from "@/lib/types";
import { TransactionFilters } from "./TransactionFilters";
import TransactionColumns from "./TransactionColumns";
import TransactionDateHeader from "./TransactionDateHeader";
import ExportToExcel from '@/components/ui/ExportToExcel';
import { useTransactionExportData } from '@/hooks/useTransactionExportData';

export function TransactionList({
  transactions,
  refreshTransactions,
}: TransactionListProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filteredData, setFilteredData] = useState(transactions);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null);

  // Preparar datos para exportación
  const exportData = useTransactionExportData(filteredData);

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
          <TransactionColumns row={row} />
        ),
      },
      {
        id: "date",
        header: ({ column }) => (
          <TransactionDateHeader column={column} />
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
              {row.original.transaction.amount}{" "}
              {row.original.transaction.ticker}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "purchase_price",
        header: "Precio C ó V",
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
        header: "Precio de Mercado",
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
        header: "Total Invertido",
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
        header: "Valor de Mercado",
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
        accessorFn: (row) =>
          row.transaction.type === "venta"
            ? row.transaction.total - row.current_price * row.transaction.amount
            : row.gain_loss,
        cell: ({ row }) => {
          // Para ventas, calculamos la ganancia como total - (precio_actual * cantidad)
          const currentMarketValue =
            row.original.current_price * row.original.transaction.amount;

          const gainLoss =
            row.original.transaction.type === "venta"
              ? row.original.transaction.total - currentMarketValue
              : row.original.gain_loss;

          const gainLossPercent =
            row.original.transaction.type === "venta"
              ? (gainLoss / row.original.transaction.total) * 100
              : row.original.gain_loss_percent;

          const isProfit = gainLoss >= 0;
          return (
            <div className="max-w-[190px] text-left">
              <div className="flex flex-col items-start">
                <span
                  className={`font-bold text-base ${
                    isProfit ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {formatCurrency(gainLoss)}
                </span>
                <span
                  className={`text-sm ${
                    isProfit ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isProfit ? "+" : ""}
                  {gainLossPercent.toFixed(2)}%
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
    setSorting([
      {
        id: "date",
        desc: true, // Ordenar de más reciente a más antigua
      },
    ]);
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
    // Cerrar el diálogo
    setIsDialogOpen(false);

    // Limpiar la transacción seleccionada
    setSelectedTransaction(null);

    // Actualizar los datos
    if (refreshTransactions) {
      refreshTransactions();
    }
  };

  // Función para manejar la actualización de una transacción
  const handleTransactionUpdated = () => {
    // Cerrar el modal de edición
    setIsEditModalOpen(false);

    // Limpiar la transacción seleccionada para editar
    setTransactionToEdit(null);

    // Actualizar los datos
    if (refreshTransactions) {
      refreshTransactions();
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
        <TransactionFilters
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          clearAllFilters={clearAllFilters}
          clearDateFilter={clearDateFilter}
          clearSearchFilter={clearSearchFilter}
          hasActiveFilters={hasActiveFilters}
          uniqueDates={uniqueDates}
          transactionsCount={transactions.length}
          filteredCount={filteredData.length}
          exportButton={
            <ExportToExcel 
              data={exportData}
              filename="transacciones"
              sheetName="Transacciones"
              buttonText="Exportar Transacciones"
              className=""
            />
          }
        />
        <CardContent>
          {filteredData.length > 0 ? (
            <div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {table.getHeaderGroups().map((headerGroup) =>
                      headerGroup.headers.map((header) => (
                        <TableHead className="text-zinc-200" key={header.id}>
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
