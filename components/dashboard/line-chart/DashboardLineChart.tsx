"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { getInvestmentHistory } from "@/lib/actions";
import { InvestmentHistoryResponse, HistoryValue } from "@/lib/interface";
import { formatCurrency } from "@/lib/types";

const chartConfig = {
  valor: {
    label: "Valor",
    color: "#f1f5f9", // gray-100
  },
} satisfies ChartConfig;

type TimeRange = "today" | "7d" | "30d" | "all";

function DashboardLineChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [chartData, setChartData] = useState<HistoryValue[]>([]);
  const [maxValues, setMaxValues] = useState<HistoryValue[]>([]);
  const [minValues, setMinValues] = useState<HistoryValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profitPercentage, setProfitPercentage] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        let params = {};

        switch (timeRange) {
          case "today":
            params = { show_today: true };
            break;
          case "7d":
            params = { show_7d: true };
            break;
          case "30d":
            params = { show_30d: true };
            break;
          case "all":
            params = { show_all: true };
            break;
        }

        const result = await getInvestmentHistory(params);

        if (result.success && result.data) {
          const data = result.data as InvestmentHistoryResponse;
          setChartData(data.investment_history.values);
          setMaxValues(data.investment_history.max_values);
          setMinValues(data.investment_history.min_values);

          // Si hay snapshots, tomamos el último para mostrar el beneficio
          if (
            data.investment_history.snapshots &&
            data.investment_history.snapshots.length > 0
          ) {
            const lastSnapshot =
              data.investment_history.snapshots[
                data.investment_history.snapshots.length - 1
              ];
            setProfitPercentage(lastSnapshot.profit_percentage);
            setTotalProfit(lastSnapshot.profit);
          }
        } else {
          setError(result.error || "Error al cargar los datos");
        }
      } catch (err) {
        setError("Error al cargar los datos del historial de inversiones");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "today":
        return "Últimas 24 horas";
      case "7d":
        return "Últimos 7 días";
      case "30d":
        return "Últimos 30 días";
      case "all":
        return "Todo el historial";
    }
  };

  return (
    <Card className="w-full h-full bg-zinc-800 border-zinc-600">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-zinc-100">
              Historial de Inversiones
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {getTimeRangeLabel()}
            </CardDescription>
            <div className="flex space-x-2 mt-2">
              <Button
                variant={timeRange === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("today")}
                className="text-xs"
              >
                24h
              </Button>
              <Button
                variant={timeRange === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("7d")}
                className="text-xs"
              >
                7d
              </Button>
              <Button
                variant={timeRange === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("30d")}
                className="text-xs"
              >
                30d
              </Button>
              <Button
                variant={timeRange === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("all")}
                className="text-xs"
              >
                Todo
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {/* <div className="flex gap-2 font-medium leading-none">
              {profitPercentage >= 0 ? (
                <>
                  <span className="text-green-400">
                    Subiendo un {profitPercentage.toFixed(2)}%
                  </span>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </>
              ) : (
                <>
                  <span className="text-red-400">
                    Bajando un {Math.abs(profitPercentage).toFixed(2)}%
                  </span>
                  <TrendingDown className="h-4 w-4 text-red-400" />
                </>
              )}
            </div>
            <div className="leading-none text-muted-foreground">
              {profitPercentage >= 0
                ? `Beneficio total: ${formatCurrency(totalProfit)}`
                : `Pérdida total: ${formatCurrency(Math.abs(totalProfit))}`}
            </div> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[20rem]">
            <p className="text-zinc-400">Cargando datos...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[20rem]">
            <p className="text-red-400">{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[20rem]">
            <p className="text-zinc-400">
              No hay datos disponibles para este período
            </p>
          </div>
        ) : (
          <ChartContainer className="h-[20rem] w-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  left: 12,
                  right: 10,
                  bottom: 20,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#444"
                />
                <XAxis
                  dataKey="fecha"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="#666"
                />
                <YAxis
                  tickFormatter={(value) =>
                    formatCurrency(value).replace("USD", "")
                  }
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="#666"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      // Buscar valores máximos y mínimos para esta fecha
                      const maxValue =
                        maxValues.find((item) => item.fecha === label)?.valor ||
                        0;
                      const minValue =
                        minValues.find((item) => item.fecha === label)?.valor ||
                        0;

                      return (
                        <div className="bg-zinc-800 border border-zinc-700 p-3 rounded shadow-lg">
                          <p className="text-gray-100 font-medium mb-1">{`Fecha: ${label}`}</p>
                          <p className="text-gray-100 mb-1">{`Valor: ${formatCurrency(
                            Number(payload[0].value)
                          )}`}</p>
                          <p className="text-green-400 mb-1">{`Máximo: ${formatCurrency(
                            maxValue
                          )}`}</p>
                          <p className="text-red-400 mb-1">{`Mínimo: ${formatCurrency(
                            minValue
                          )}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  dataKey="valor"
                  type="monotone"
                  stroke="#f1f5f9"
                  strokeWidth={2}
                  dot={{
                    fill: "#f1f5f9",
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#f1f5f9",
                    stroke: "#f1f5f9",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        
      </CardFooter> */}
    </Card>
  );
}

export default DashboardLineChart;
