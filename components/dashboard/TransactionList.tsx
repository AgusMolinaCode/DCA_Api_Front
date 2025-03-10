import React from 'react';

interface Transaction {
  id: string;
  crypto_name: string;
  ticker: string;
  amount: number;
  purchase_price: number;
  image_url?: string;
  date: string;
  type: 'compra' | 'venta';
  note?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div>
      <p className="text-lg mb-4">Tienes {transactions.length} transacciones registradas</p>
      <div className="grid gap-4">
        {transactions.map((transaction, index) => (
          <div key={transaction.id || index} className="border rounded-lg p-4 flex items-center">
            <div className="mr-4">
              {transaction.image_url && (
                <img 
                  src={transaction.image_url} 
                  alt={transaction.crypto_name} 
                  className="w-12 h-12 rounded-full"
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{transaction.crypto_name}</h3>
              <p className="text-sm text-muted-foreground">{transaction.ticker}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {transaction.type === 'compra' ? '+' : '-'} {transaction.amount} {transaction.ticker}
              </p>
              <p className="text-sm text-muted-foreground">
                ${transaction.purchase_price} USD
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 