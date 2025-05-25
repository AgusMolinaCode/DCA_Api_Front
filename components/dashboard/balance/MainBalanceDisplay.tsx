"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DashboardMainBalanceProps } from "@/lib/interface";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface MainBalanceDisplayProps {
  data: DashboardMainBalanceProps;
}

export default function MainBalanceDisplay({ data }: MainBalanceDisplayProps) {
  const {
    total_current_value,
    total_invested,
    total_profit,
    profit_percentage,
  } = data;
  const isPositive = profit_percentage >= 0;

  return (
    <Card className="w-full sm:w-[24rem] h-auto bg-zinc-800 border-zinc-600">
      <CardContent className="p-6">
        <div className="flex flex-col items-center mx-auto">
          <h3 className="text-zinc-100 text-xl font-bold">
            Balance Total
          </h3>

          <div className="text-4xl font-bold text-zinc-100 mb-2">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(total_current_value)}
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-zinc-300 text-lg">
              Invertido:{" "}
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(total_invested)}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex items-center gap-1 ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              <span className="text-zinc-300 text-lg">
                {isPositive ? "Ganancia 24h" : "Perdida 24h"}:
              </span>
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              <span className="font-semibold">
                {profit_percentage.toFixed(2)}%
              </span>
            </div>

            <div
              className={`${isPositive ? "text-green-500" : "text-red-500"}`}
            >
              <span className="text-zinc-300 text-lg">Profit 24h:</span>
              <span className="font-semibold">
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(total_profit)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
