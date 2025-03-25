"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { DashboardItem } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { TokenIcon } from "@web3icons/react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
  imageUrl: string;
}) => {
  // Estado para controlar si hay un error al cargar el TokenIcon
  const [iconError, setIconError] = useState(false);

  return (
    <div className="relative w-8 h-8">
      {!iconError ? (
        <TokenIcon
          name={ticker.toUpperCase()}
          onError={() => setIconError(true)}
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
      ) : (
        <Image
          src={imageUrl || "/images/cripto.png"}
          alt={ticker}
          width={32}
          height={32}
          className="object-contain"
        />
      )}
    </div>
  );
};

interface CryptoTableProps {
  dashboardData: DashboardItem[];
  refreshData?: () => void;
}

const CryptoTable = ({ dashboardData, refreshData }: CryptoTableProps) => {
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
      <div className="flex items-center gap-2">
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

  // Definir las columnas
  const columns: ColumnDef<DashboardItem>[] = [
    {
      accessorKey: "crypto_name",
      header: "Criptomoneda",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CryptoIcon
            ticker={row.original.ticker}
            imageUrl={row.original.image_url}
          />
          <span className="font-semibold text-base">
            {row.original.crypto_name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "total_invested",
      header: ({ column }) => renderSortableHeader(column, "Total Invertido"),
      cell: ({ row }) => (
        <span className="font-bold text-base">
          {formatCurrency(row.original.total_invested)}
        </span>
      ),
    },
    {
      accessorKey: "current_price",
      header: "Precio Actual",
      cell: ({ row }) => (
        <span className="font-bold text-base">
          {formatCurrency(row.original.current_price)}
        </span>
      ),
    },
    {
      accessorKey: "price_diff",
      header: "Diferencia Precio",
      cell: ({ row }) => {
        const priceDiff = row.original.current_price - row.original.avg_price;
        return (
          <span
            className={`font-bold text-base ${
              priceDiff >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(priceDiff)}
          </span>
        );
      },
    },
    {
      accessorKey: "avg_price",
      header: "Precio Promedio",
      cell: ({ row }) => (
        <span className="font-bold text-base">
          {formatCurrency(row.original.avg_price)}
        </span>
      ),
    },
    {
      accessorKey: "current_profit",
      header: ({ column }) => renderSortableHeader(column, "Profit Actual"),
      cell: ({ row }) => (
        <div className="flex flex-col font-semibold">
          <span
            className={`text-base ${
              row.original.current_profit >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formatCurrency(row.original.current_profit)}
          </span>
          <span
            className={`text-sm ${
              row.original.profit_percent >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {row.original.profit_percent.toFixed(2)}%
          </span>
        </div>
      ),
    },
    {
      accessorKey: "holdings",
      header: "Tenencias",
      cell: ({ row }) => {
        const holdingsValue =
          row.original.holdings * row.original.current_price;
        return (
          <div className="flex flex-col font-bold">
            <span
              className={`text-base ${
                holdingsValue >= row.original.total_invested
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(holdingsValue)}
            </span>
            <span className="text-sm text-zinc-400">
              {row.original.holdings} {row.original.ticker}
            </span>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "total_invested",
      desc: true,
    },
  ]);

  // Configurar la tabla con paginación
  const table = useReactTable({
    data: dashboardData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, // Mostrar 10 criptomonedas por página
      },
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="overflow-x-auto">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-zinc-200"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4 mt-auto">
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
  );
};

export default CryptoTable;
