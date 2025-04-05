import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

const TransactionDateHeader = ({ column }: { column: any }) => {
  return (
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
  );
};

export default TransactionDateHeader;
