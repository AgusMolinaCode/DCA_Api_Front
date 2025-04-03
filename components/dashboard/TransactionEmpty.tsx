import React from 'react';

export function TransactionEmpty() {
  return (
    <div className="p-6 rounded-lg text-center bg-zinc-800 border border-zinc-600">
      <p className="mb-4 text-zinc-100 text-xl  md:text-2xl">No tienes transacciones registradas</p>
      <p className="text-zinc-100">
        Usa el botón "Transacción" para agregar tu primera criptomoneda.
      </p>
    </div>
  );
} 