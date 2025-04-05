import React from "react";
import { CryptoIcon } from "./CryptoIcon";
import { Row } from "@tanstack/react-table";
import { TransactionWithPerformance } from "@/lib/interface";

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
  );
};

export default TransactionColumns;
