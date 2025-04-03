import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getTrasactionsDashboard } from "@/lib/actions";
import CryptoTable from "./CryptoTable";

async function DashboardBalance({ refreshData }: { refreshData?: () => void }) {
  const response = await getTrasactionsDashboard();
  const dashboardData =
    response.success && response.data ? response.data.dashboard || [] : [];
  const error = !response.success ? response.error : null;

  return (
    <div className="space-y-4">
      <Card className="bg-zinc-800 border-zinc-600">
        <CardHeader>
          <CardTitle className="text-zinc-100">Mis Criptomonedas</CardTitle>
          <CardDescription className="text-zinc-200">
            Resumen de tus inversiones en criptomonedas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex justify-center py-4 text-red-500">
              <p>{error}</p>
            </div>
          ) : dashboardData.length === 0 ? (
            <div className="flex justify-center py-4">
              <p className="text-zinc-100 text-xl md:text-2xl">No hay datos disponibles</p>
            </div>
          ) : (
            <div className="space-y-3">
              <CryptoTable dashboardData={dashboardData} refreshData={refreshData} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardBalance;
