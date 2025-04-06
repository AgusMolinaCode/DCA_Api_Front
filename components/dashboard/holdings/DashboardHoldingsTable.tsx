"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Chart, Distribution } from "@/lib/interface"
import { formatCurrency } from "@/lib/types"

// Definimos un tipo para los datos del gráfico
type ChartDataItem = {
  ticker: string;
  value: number;
  fill: string;
  name: string;
}

// Función para generar la configuración del gráfico a partir de los datos
const generateChartConfig = (distribution: Distribution[]): ChartConfig => {
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
      color: item.color,
    };
  });

  return config as ChartConfig;
};

interface DashboardHoldingsTableProps {
  data: Chart;
}

export default function DashboardHoldingsTable({ data: chartData }: DashboardHoldingsTableProps) {
  const id = "crypto-holdings-pie"
  
  // Preparamos los datos para el gráfico
  const pieData: ChartDataItem[] = chartData.distribution.map((item) => ({
    ticker: item.ticker,
    name: item.name,
    value: item.weight,
    fill: item.color,
  }));
  
  // Generamos la configuración del gráfico
  const chartConfig = generateChartConfig(chartData.distribution);
  
  // Estado para el elemento activo
  const [activeTicker, setActiveTicker] = React.useState<string>(pieData[0]?.ticker || "");
  
  // Calculamos el índice activo
  const activeIndex = React.useMemo(
    () => pieData.findIndex((item) => item.ticker === activeTicker),
    [activeTicker, pieData]
  );
  
  // Obtenemos la lista de tickers
  const tickers = React.useMemo(() => pieData.map((item) => item.ticker), [pieData]);
  
  // Formateamos los valores para mostrar
  const formattedTotalValue = formatCurrency(chartData.total_current_value);
  const formattedTotalInvested = formatCurrency(chartData.total_invested);
  const formattedProfit = formatCurrency(chartData.total_profit);
  const profitPercentage = chartData.profit_percentage.toFixed(2);
  
  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Distribución de Criptomonedas</CardTitle>
          <CardDescription>
            Total: {formattedTotalValue} | Invertido: {formattedTotalInvested} | 
            Ganancia: {formattedProfit} ({profitPercentage}%)
          </CardDescription>
        </div>
        <Select value={activeTicker} onValueChange={setActiveTicker}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Seleccionar criptomoneda"
          >
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {tickers.map((ticker) => {
              const item = pieData.find(d => d.ticker === ticker);
              if (!item) return null;
              
              return (
                <SelectItem
                  key={ticker}
                  value={ticker}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: item.fill,
                      }}
                    />
                    {item.name} ({ticker})
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="ticker"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const activeItem = pieData[activeIndex];
                    if (!activeItem) return null;
                    
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {activeItem.value.toFixed(2)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {activeItem.name}
                        </tspan>
                      </text>
                    )
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}