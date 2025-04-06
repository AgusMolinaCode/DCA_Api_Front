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
import { Chart, Distribution, OthersDetail } from "@/lib/interface"
import { formatCurrency } from "@/lib/types"

// Definimos un tipo para los datos del gráfico
type ChartDataItem = {
  ticker: string;
  name: string;
  value: number;
  weight: number;
  fill: string;
  isOthers?: boolean;
  othersDetail?: OthersDetail[];
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
  
  // Preparamos los datos para el gráfico usando directamente los datos de la API
  const pieData: ChartDataItem[] = React.useMemo(() => {
    return chartData.distribution.map((item) => ({
      ticker: item.ticker,
      name: item.name,
      value: item.value,
      weight: item.weight,
      fill: item.color,
      isOthers: item.is_others || false,
      othersDetail: item.others_detail || [],
    }));
  }, [chartData.distribution]);
  
  // Generamos la configuración del gráfico
  const chartConfig = React.useMemo(() => {
    const config = generateChartConfig(chartData.distribution);
    return config;
  }, [chartData.distribution]);
  
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
  
  // Obtenemos el elemento activo
  const activeItem = pieData[activeIndex];
  
  return (
    <Card data-chart={id} className="flex flex-col w-full max-w-xs">
      <ChartStyle id={id} config={chartConfig} />
      <div className="px-4 pt-4 pb-2 flex justify-between items-center">
        <h3 className="text-sm font-medium">Distribución</h3>
        <Select value={activeTicker} onValueChange={setActiveTicker}>
          <SelectTrigger
            className="h-7 w-[230px] rounded-lg pl-2.5"
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
                    {ticker === "OTROS" ? "Otros" : `${item.name} (${ticker})`}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
      
      <CardContent className="flex flex-col items-center pt-0 pb-4">
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
                          <div className="text-muted-foreground">Valor:</div>
                          <div className="text-right font-medium">{formatCurrency(data.value)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Porcentaje:</div>
                          <div className="text-right font-medium">{data.weight.toFixed(2)}%</div>
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
              innerRadius={66}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 8} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 16}
                    innerRadius={outerRadius + 10}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    if (!activeItem) return null;
                    
                    const isOthers = activeItem.ticker === "OTROS";
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
                          className="fill-foreground text-lg font-bold"
                        >
                          {formatCurrency(activeItem.value)}
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy + 15}
                          className="fill-muted-foreground text-sm"
                        >
                          {activeItem.weight.toFixed(2)}%
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
        
        {/* Lista de criptomonedas con porcentajes */}
        <div className="w-full mt-4 space-y-2.5 px-2">
          {pieData.map((item) => (
            <div 
              key={item.ticker} 
              className={`flex items-center justify-between py-1 cursor-pointer hover:bg-muted/50 rounded-md transition-colors ${item.ticker === activeTicker ? 'bg-muted/70 rounded-md' : ''}`}
              onClick={() => setActiveTicker(item.ticker)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="font-medium">{item.ticker}</span>
              </div>
              <span className="font-bold">{item.weight.toFixed(2)}%</span>
            </div>
          ))}
        </div>
        
        {/* Mostrar detalles de la categoría "Otros" si está seleccionada */}
        {activeItem?.isOthers && activeItem.othersDetail && activeItem.othersDetail.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-md w-full">
            <h4 className="text-sm font-medium mb-2">Detalle de Otros ({formatCurrency(activeItem.value)})</h4>
            <div className="space-y-2">
              {activeItem.othersDetail.map((detail) => (
                <div key={detail.ticker} className="flex justify-between text-xs">
                  <span className="font-medium">{detail.name} ({detail.ticker})</span>
                  <div>
                    <span className="mr-2">{formatCurrency(detail.value)}</span>
                    <span className="text-muted-foreground">({detail.weight.toFixed(4)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}