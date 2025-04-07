import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { getCurrentBalance } from "@/lib/actions";
import { DashboardMainBalanceProps } from "@/lib/interface";
import { formatCurrency } from "@/lib/types";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import MainBalanceDisplay from "./MainBalanceDisplay";


export async function DashboardMainBalance() {
  // Obtenemos los datos de la API
  const response = await getCurrentBalance();
  
  if (!response.success || !response.data) {
    return (
      <Card className="w-full bg-zinc-800 border-zinc-600">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-40 text-red-400">
            <p className="text-center">{response.error || "No hay datos disponibles"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <MainBalanceDisplay data={response.data} />
  );
}

export default DashboardMainBalance;