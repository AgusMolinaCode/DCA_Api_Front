import * as React from "react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
  
import { getHoldingsChart } from "@/lib/actions"
import DashboardHoldingsTable from "./DashboardHoldingsTable";




export async function DashboardHoldings() {
  const id = "crypto-holdings-pie"
  
  // Obtenemos los datos de la API
  const response = await getHoldingsChart();
  
  if (!response.success || !response.data) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Distribución de Criptomonedas</CardTitle>
          <CardDescription>No hay datos disponibles</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <DashboardHoldingsTable data={response.data} />
  )
}

export default DashboardHoldings
