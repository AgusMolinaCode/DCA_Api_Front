import React from "react";
import { CryptoIcon } from "./CryptoIcon";
import { Row } from "@tanstack/react-table";
import { TransactionWithPerformance } from "@/lib/interface";

// Función para truncar nombres largos de criptomonedas
const truncateCryptoName = (name: string, ticker: string): string => {
  // Si el nombre es corto (menos de 20 caracteres), lo mostramos completo
  if (name.length <= 20) {
    return name;
  }
  
  // Verificamos si el nombre incluye el ticker entre paréntesis
  const tickerInParenthesis = `(${ticker})`;
  if (name.includes(tickerInParenthesis)) {
    // Extraemos la parte del nombre antes del ticker
    const namePart = name.split(tickerInParenthesis)[0].trim();
    // Si el nombre es muy largo, lo truncamos
    if (namePart.length > 10) {
      return `${namePart.substring(0, 10)}... ${tickerInParenthesis}`;
    }
    return `${namePart} ${tickerInParenthesis}`;
  }
  
  // Si no tiene el formato esperado, simplemente truncamos
  return `${name.substring(0, 10)}...`;
};

interface TransactionColumnsProps {
  row: Row<TransactionWithPerformance>;
}

const TransactionColumns = ({ row }: TransactionColumnsProps) => {
  return (
    <div className="flex items-center gap-2">
      <CryptoIcon
        ticker={row.original.transaction.ticker}
        imageUrl={row.original.transaction.image_url}
      />
      <div className="flex justify-between items-center w-[250px]">
        <div className="flex flex-col">
          <span className="font-semibold text-base text-zinc-100 truncate" title={row.original.transaction.crypto_name}>
            {truncateCryptoName(row.original.transaction.crypto_name, row.original.transaction.ticker)}
          </span>
          <span className="text-sm text-zinc-100 truncate">
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
  );
};

export default TransactionColumns;
