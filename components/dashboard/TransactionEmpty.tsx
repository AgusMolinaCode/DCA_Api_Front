import React from 'react';

export function TransactionEmpty() {
  return (
    <div className="bg-muted p-6 rounded-lg text-center">
      <p className="text-lg mb-4">No tienes transacciones registradas</p>
      <p className="text-muted-foreground">
        Usa el botón "Transacción" para agregar tu primera criptomoneda
      </p>
    </div>
  );
} 