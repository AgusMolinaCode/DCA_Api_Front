"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Chart, Distribution, OthersDetail } from "@/lib/interface";
import { formatCurrency } from "@/lib/types";
import { generateDynamicColors } from "@/lib/chartColor";

// Definimos un tipo para los datos del gráfico
type ChartDataItem = {
  ticker: string;
  name: string;
  value: number;
  weight: number;
  fill: string;
  isOthers?: boolean;
  othersDetail?: OthersDetail[];
};

// Función para generar la configuración del gráfico a partir de los datos
const generateChartConfig = (
  distribution: Distribution[],
  colorMap: Record<string, string>
): ChartConfig => {
  const config: Record<string, { label: string; color: string }> = {
    value: {
      label: "Valor",
      color: "#000000", // Color por defecto
    },
  };

  // Agregamos cada criptomoneda a la configuración
  distribution.forEach((item) => {
    config[item.ticker] = {
      label: item.name,
      color: colorMap[item.ticker] || item.color, // Usar el color dinámico o el original como respaldo
    };
  });

  return config as ChartConfig;
};

interface DashboardHoldingsTableProps {
  data: Chart;
}

// Número máximo de criptomonedas a mostrar en la lista
const MAX_VISIBLE_CRYPTOS = 6;

export default function DashboardHoldingsTable({
  data: chartData,
}: DashboardHoldingsTableProps) {
  const id = "crypto-holdings-pie";
  const [showAllDialog, setShowAllDialog] = React.useState(false);

  // Procesamos los datos para mostrar solo un número limitado de criptomonedas
  const { visibleData, hiddenData, allData } = React.useMemo(() => {
    // Ordenamos las criptomonedas por peso (porcentaje) de mayor a menor
    const sortedDistribution = [...chartData.distribution]
      .filter((item) => !item.is_others) // Filtramos los que ya son 'otros'
      .sort((a, b) => b.weight - a.weight);

    // Siempre mostramos solo las top 6 criptomonedas
    const visible = sortedDistribution.slice(0, MAX_VISIBLE_CRYPTOS);
    const hidden = sortedDistribution.slice(MAX_VISIBLE_CRYPTOS);

    return {
      visibleData: visible, // Solo las top 6, sin categoría 'Otros'
      hiddenData: hidden, // Las restantes para el modal
      allData: sortedDistribution, // Todas las criptomonedas para el modal
    };
  }, [chartData.distribution]);

  // Obtenemos la lista de tickers
  const tickers = React.useMemo(
    () => visibleData.map((item) => item.ticker),
    [visibleData]
  );

  // Generamos colores dinámicos para los tickers
  const dynamicColors = React.useMemo(
    () => generateDynamicColors(tickers),
    [tickers]
  );

  // Preparamos los datos para el gráfico usando directamente los datos procesados
  const pieData: ChartDataItem[] = React.useMemo(() => {
    return visibleData.map((item) => ({
      ticker: item.ticker,
      name: item.name,
      value: item.value,
      weight: item.weight,
      fill:
        item.ticker === "OTROS"
          ? "#9ca3af"
          : dynamicColors[item.ticker] || item.color, // Color especial para 'Otros'
      isOthers: item.is_others || false,
      othersDetail: item.others_detail || [],
    }));
  }, [visibleData, dynamicColors]);

  // Generamos la configuración del gráfico
  const chartConfig = React.useMemo(() => {
    const config = generateChartConfig(visibleData, dynamicColors);
    return config;
  }, [visibleData, dynamicColors]);

  // Estado para el elemento activo
  const [activeTicker, setActiveTicker] = React.useState<string | null>(
    pieData[0]?.ticker || null
  );

  // Calculamos el índice activo
  const activeIndex = React.useMemo(
    () =>
      activeTicker
        ? pieData.findIndex((item) => item.ticker === activeTicker)
        : -1,
    [activeTicker, pieData]
  );

  // Formateamos los valores para mostrar
  const formattedTotalValue = formatCurrency(chartData.total_current_value);
  const formattedTotalInvested = formatCurrency(chartData.total_invested);
  const formattedProfit = formatCurrency(chartData.total_profit);
  const profitPercentage = chartData.profit_percentage.toFixed(2);

  // Obtenemos el elemento activo
  const activeItem = activeIndex !== -1 ? pieData[activeIndex] : null;

  // Verificar si hay datos de tenencias
  const hasTenencias =
    chartData.distribution && chartData.distribution.length > 0;

  return (
    <Card
      data-chart={id}
      className="flex flex-col bg-zinc-800 border-zinc-600 h-full"
    >
      <ChartStyle id={id} config={chartConfig} />
      <div className="px-4 pt-4 pb-2 grid gap-2 items-center">
        <h3 className="text-zinc-100 text-xl font-bold">Tenencias</h3>
        {hasTenencias && (
          <Select
            value={activeTicker || ""}
            onValueChange={(value) => {
              // Si seleccionamos el mismo valor que ya está activo, lo desactivamos
              if (value === activeTicker) {
                setActiveTicker(null);
              } else {
                setActiveTicker(value);
              }
            }}
          >
            <SelectTrigger
              className="h-7 w-[230px] rounded-lg pl-2.5 hover:bg-zinc-700"
              aria-label="Seleccionar criptomoneda"
            >
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent
              align="end"
              className="rounded-xl bg-zinc-800 border-zinc-700"
            >
              <style jsx global>{`
                /* Sobrescribir estilos del SelectItem */
                [data-slot="select-item"] {
                  background-color: rgb(39 39 42) !important;
                  color: rgb(244 244 245) !important;
                }
                [data-slot="select-item"]:hover,
                [data-slot="select-item"]:focus,
                [data-slot="select-item"][data-highlighted] {
                  background-color: rgb(63 63 70) !important;
                  color: rgb(244 244 245) !important;
                }
                [data-slot="select-content"] {
                  background-color: rgb(39 39 42) !important;
                  border-color: rgb(82 82 91) !important;
                }
              `}</style>
              {tickers.map((ticker) => {
                const item = pieData.find((d) => d.ticker === ticker);
                if (!item) return null;

                return (
                  <SelectItem
                    key={ticker}
                    value={ticker}
                    className="rounded-lg [&_span]:flex hover:bg-zinc-700"
                  >
                    <div className="flex items-center gap-2 text-xs text-zinc-100">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-sm"
                        style={{
                          backgroundColor: item.fill,
                        }}
                      />
                      {ticker === "OTROS" ? "Otros" : `${item.name}`}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      </div>

      <CardContent className="flex flex-col items-center pt-0 pb-4">
        {!hasTenencias ? (
          <div className="flex items-center justify-center h-[20rem]">
            <p className="text-zinc-400">
              No hay tenencias disponibles
            </p>
          </div>
        ) : (
          <div>
            <ChartContainer
              id={id}
              config={chartConfig}
              className="aspect-square w-full max-w-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartDataItem;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid gap-1">
                            <div className="flex items-center gap-1">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: data.fill }}
                              />
                              <span className="font-medium">{data.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-muted-foreground">
                                Valor:
                              </div>
                              <div className="text-right font-medium">
                                {formatCurrency(data.value)}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-muted-foreground">
                                Porcentaje:
                              </div>
                              <div className="text-right font-medium">
                                {data.weight.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={pieData}
                  dataKey="weight"
                  nameKey="ticker"
                  innerRadius={78}
                  strokeWidth={10}
                  activeIndex={activeIndex !== -1 ? activeIndex : undefined}
                  activeShape={
                    activeIndex !== -1
                      ? ({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                          <g>
                            <Sector {...props} outerRadius={outerRadius + 8} />
                            <Sector
                              {...props}
                              outerRadius={outerRadius + 16}
                              innerRadius={outerRadius + 10}
                            />
                          </g>
                        )
                      : undefined
                  }
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        if (!activeItem) {
                          // Si no hay elemento activo, mostrar el valor total
                          const cx = viewBox.cx || 0;
                          const cy = viewBox.cy || 0;

                          return (
                            <text
                              x={cx}
                              y={cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={cx}
                                y={cy - 10}
                                className="fill-gray-100 text-lg font-bold"
                              >
                                {formattedTotalValue}
                              </tspan>
                              <tspan
                                x={cx}
                                y={cy + 15}
                                className="fill-muted-foreground text-sm"
                              >
                                Total
                              </tspan>
                            </text>
                          );
                        }

                        const isOthers = activeItem.ticker === "OTROS";
                        const cx = viewBox.cx || 0;
                        const cy = viewBox.cy || 0;

                        return (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-zinc-100 text-md font-semibold"
                          >
                            <tspan
                              x={cx}
                              y={cy - 10}
                              className="text-lg fill-gray-100 font-semibold"
                            >
                              {formatCurrency(activeItem.value)}
                            </tspan>
                            <tspan
                              x={cx}
                              y={cy + 15}
                              className="fill-gray-300 text-sm"
                            >
                              {activeItem.weight.toFixed(2)}%
                            </tspan>
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Lista de criptomonedas con porcentajes */}
            <div className="w-full mt-4 px-2">
              <div className="grid grid-cols-2 gap-2">
                {pieData.map((item) => (
                  <div
                    key={item.ticker}
                    className={`flex items-center justify-between py-1 cursor-pointer hover:bg-zinc-700 p-1 rounded-md transition-colors ${
                      item.ticker === activeTicker
                        ? "p-2 rounded-md hover:bg-zinc-600"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveTicker(
                        item.ticker === activeTicker ? null : item.ticker
                      )
                    }
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className="flex h-4 w-4 shrink-0 rounded-full text-zinc-100"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="font-medium text-sm text-zinc-100">
                        {item.ticker}
                      </span>
                    </div>
                    <span className="font-bold text-zinc-100 ml-1 text-sm">
                      {item.weight.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Botu00f3n para ver todas las criptomonedas */}
              {hiddenData.length > 0 && (
                <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border-zinc-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ver {hiddenData.length} más
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-800 border-zinc-600 text-zinc-100">
                    <DialogHeader>
                      <DialogTitle className="text-zinc-100">
                        Todas las criptomonedas
                      </DialogTitle>
                    </DialogHeader>

                    <div className="mt-2">
                      <h3 className="text-sm font-medium mb-2 text-zinc-100">
                        Criptomonedas adicionales ({hiddenData.length})
                      </h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 mt-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                      {/* Mostrar solo las criptomonedas que no aparecen en la vista principal */}
                      {hiddenData.map((item) => (
                        <div
                          key={item.ticker}
                          className="flex items-center justify-between p-2 bg-zinc-700 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="flex h-4 w-4 shrink-0 rounded-full"
                              style={{
                                backgroundColor:
                                  dynamicColors[item.ticker] || item.color,
                              }}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {item.ticker}
                              </span>
                              <span className="text-xs text-zinc-400">
                                {item.name}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-sm">
                              {formatCurrency(item.value)}
                            </span>
                            <span className="text-xs text-zinc-400">
                              {item.weight.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Agregar estilos para el scrollbar */}
            <style jsx global>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #27272a;
                border-radius: 3px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #52525b;
                border-radius: 3px;
              }
            `}</style>

            {/* Mostrar detalles de la categoría "Otros" si está seleccionada */}
            {activeItem?.isOthers &&
              activeItem.othersDetail &&
              activeItem.othersDetail.length > 0 && (
                <div className="mt-4 p-3 bg-zinc-700 border border-zinc-600 rounded-md w-full">
                  <h4 className="text-sm font-medium mb-2 text-zinc-100">
                    Detalle de Otros ({formatCurrency(activeItem.value)})
                  </h4>
                  <div className="space-y-2">
                    {activeItem.othersDetail.map((detail) => (
                      <div
                        key={detail.ticker}
                        className="flex justify-between text-xs"
                      >
                        <span className="font-medium text-zinc-100">
                          {detail.name}
                        </span>
                        <div>
                          <span className="mr-2 text-zinc-100">
                            {formatCurrency(detail.value)}
                          </span>
                          <span className="text-zinc-100">
                            ({detail.weight.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
