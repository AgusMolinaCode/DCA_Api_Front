import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getPerformance } from "@/lib/actions";
import { PerformanceProps } from "@/lib/interface";
import PerformanceDisplay from "@/components/dashboard/performance/PerformanceDisplay";

export async function DashboardPerformance() {
  // Obtenemos los datos de la API
  const response = await getPerformance();
  
  if (!response.success || !response.data) {
    return (
      <Card className="w-full bg-zinc-800 border-zinc-600">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-40 text-red-400">
            <p className="text-center">{response.error || "No hay datos disponibles de rendimiento"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Mapear los datos de la API a la estructura que espera PerformanceDisplay
  const mappedData: PerformanceProps = {
    performance: {
      top_gainer: response.data.top_gainer || null,
      top_loser: response.data.top_loser || null
    }
  };
  
  return (
    <PerformanceDisplay data={mappedData} />
  );
}

export default DashboardPerformance;