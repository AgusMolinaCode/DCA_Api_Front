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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="md:w-[200px]">Criptomoneda</TableHead>
                    <TableHead>Total Invertido</TableHead>
                    <TableHead>Precio Actual</TableHead>
                    <TableHead>Diferencia Precio</TableHead>
                    <TableHead>Precio Promedio</TableHead>
                    <TableHead>Profit Actual</TableHead>
                    <TableHead>Tenencias</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.map((item: DashboardItem, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold">
                        <Image
                          src={item.image_url}
                          alt={item.crypto_name}
                          width={44}
                          height={44}
                          className="object-contain"
                        />
                        {item.crypto_name}
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(item.total_invested)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(item.current_price)}
                      </TableCell>
                      <TableCell className="font-bold">
                        <span
                          className={`${
                            item.current_price - item.avg_price >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(item.current_price - item.avg_price)}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(item.avg_price)}
                      </TableCell>
                      <TableCell className="font-bold">
                        <div className="flex flex-col">
                          <span
                            className={`${
                              item.current_profit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(item.current_profit)}
                          </span>
                          <span
                            className={`text-sm ${
                              item.profit_percent >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.profit_percent.toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        <div className="flex flex-col">
                          <span
                            className={`${
                              item.holdings * item.current_price >=
                              item.total_invested
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(item.holdings * item.current_price)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {item.holdings} {item.ticker}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardBalance;
