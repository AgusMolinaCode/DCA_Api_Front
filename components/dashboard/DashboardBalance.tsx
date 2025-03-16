import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getTrasactionsDashboard } from "@/lib/actions";
import { DashboardItem } from "@/lib/inteface";
import Image from "next/image";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

async function DashboardBalance() {
  const response = await getTrasactionsDashboard();
  const dashboardData =
    response.success && response.data ? response.data.dashboard || [] : [];
  const error = !response.success ? response.error : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Mis Criptomonedas</CardTitle>
          <CardDescription>
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
              <p>No hay datos disponibles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboardData.map((item: DashboardItem, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border-b last:border-0 hover:bg-muted/50 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.image_url}
                      alt={item.crypto_name}
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{item.crypto_name}</h3>
                        {/* <p className="text-sm text-muted-foreground">{item.ticker}</p> */}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.ticker}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p>
                        Precio promedio: {formatCurrency(item.avg_price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(item.total_invested)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Precio promedio: {formatCurrency(item.avg_price)}
                      </p>
                    </div>
                    <div
                      className={`flex items-center justify-center rounded-full px-2 py-1 ${
                        item.profit_percent >= 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span className="text-xs font-medium">
                        {item.profit_percent >= 0 ? "+" : ""}
                        {item.profit_percent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardBalance;
