import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TransactionListProps } from "@/lib/inteface";


export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Transacciones</CardTitle>
          <CardDescription>
            Tienes {transactions.length} transacciones registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <div
                key={transaction.id || index}
                className="flex items-center justify-between p-2 border-b last:border-0 hover:bg-muted/50 rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {transaction.ticker === "USDT" ? (
                      <img
                        src="https://www.cryptocompare.com/media/37746338/usdt.png"
                        alt={transaction.crypto_name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div>
                        {transaction.image_url && (
                          <img
                            src={transaction.image_url}
                            alt={transaction.crypto_name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{transaction.crypto_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">
                      {transaction.type === "compra" ? "+" : "-"} {transaction.amount}{" "}
                      {transaction.ticker}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${transaction.purchase_price.toFixed(2)} USD
                    </p>
                  </div>
                  <div className="flex items-center justify-center rounded-full w-6 h-6 bg-muted">
                    <span className="text-xs font-medium">
                      {transaction.type === "compra" ? "C" : "V"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
