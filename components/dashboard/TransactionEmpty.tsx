import React from "react";

export function TransactionEmpty() {
  return (
    <div className="p-6 rounded-lg text-center bg-zinc-800 border border-zinc-600">
      <div className="text-zinc-400 p-4 text-center">
        No tienes transacciones registradas
      </div>
    </div>
  );
}
