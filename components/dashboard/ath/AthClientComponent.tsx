"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenIcon } from '@web3icons/react';
import Image from 'next/image';
import { useState } from 'react';
import ExportToExcel from '@/components/ui/ExportToExcel';
import { useAthExportData } from '@/hooks/useAthExportData';

// Tipo para los datos combinados
interface CombinedData {
  ticker: string;
  total_invested: number;
  holdings: number;
  avg_price: number;
  current_price: number;
  current_profit: number;
  profit_percent: number;
  image_url: string;
  crypto_name: string;
  ath: number;
  athDate: string;
  athPercentChange: number;
  athPotentialValue: number;
}

// Componente para mostrar el icono de la criptomoneda
const CryptoIcon = ({ ticker }: { ticker: string }) => {
  try {
    return (
      <TokenIcon name={ticker.toLowerCase()} className="h-6 w-6" />
    );
  } catch (error) {
    // Si no se encuentra el icono, mostrar una imagen de respaldo
    return (
      <Image 
        src="/images/cripto.png" 
        alt={ticker} 
        width={24} 
        height={24} 
        className="h-6 w-6"
      />
    );
  }
};

// Componente cliente que recibe los datos y los muestra
const AthClientComponent = ({ data }: { data: CombinedData[] }) => {
  const [sortField, setSortField] = useState<keyof CombinedData>('ticker');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Calcular el total de valores en ATH
  const totalAthValue = data.reduce((sum, item) => sum + item.athPotentialValue, 0);
  
  // Preparar datos para exportación
  const exportData = useAthExportData(data);

  // Función para ordenar los datos
  const sortData = (field: keyof CombinedData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Ordenar los datos
  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  return (
    <Card className="bg-zinc-800 border-zinc-600">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-zinc-100">ATH (All-Time High)</CardTitle>
            <CardDescription className="text-zinc-400">Comparativa con máximos históricos</CardDescription>
          </div>
          <ExportToExcel 
            data={exportData}
            filename="ath_analysis"
            sheetName="ATH Analysis"
            buttonText="Exportar ATH"
            className=""
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th 
                  className="text-left py-3 cursor-pointer text-zinc-300 font-thin text-sm w-[180px] min-w-[180px]" 
                  onClick={() => sortData('crypto_name')}
                >
                  Criptomoneda {sortField === 'crypto_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-right py-3 cursor-pointer text-zinc-300 font-thin text-sm w-[120px] min-w-[120px]" 
                  onClick={() => sortData('current_price')}
                >
                  Precio Actual {sortField === 'current_price' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-right py-3 cursor-pointer text-zinc-300 font-thin text-sm w-[120px] min-w-[120px]" 
                  onClick={() => sortData('ath')}
                >
                  ATH {sortField === 'ath' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-right py-3 cursor-pointer text-zinc-300 font-thin text-sm w-[120px] min-w-[120px]" 
                  onClick={() => sortData('athDate')}
                >
                  Fecha ATH {sortField === 'athDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-right py-3 cursor-pointer text-zinc-300 font-thin text-sm w-[120px] min-w-[120px]" 
                  onClick={() => sortData('athPotentialValue')}
                >
                  Valor en ATH {sortField === 'athPotentialValue' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-right py-3 cursor-pointer text-zinc-300 font-thin text-sm w-[120px] min-w-[120px]" 
                  onClick={() => sortData('athPercentChange')}
                >
                  % desde ATH {sortField === 'athPercentChange' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr key={index} className="border-b border-zinc-800">
                  <td className="py-3 flex items-center gap-2 text-zinc-100 text-md font-semibold w-[180px] min-w-[180px]">
                    <CryptoIcon ticker={item.ticker} />
                    <span className="truncate">{item.crypto_name} ({item.ticker})</span>
                  </td>
                  <td className="text-right py-3 text-zinc-100 text-md font-semibold w-[120px] min-w-[120px]">${item.current_price.toFixed(2)}</td>
                  <td className="text-right py-3 text-zinc-100 text-md font-semibold w-[120px] min-w-[120px]">
                    {`$${item.ath.toFixed(2)}`}
                  </td>
                  <td className="text-right py-3 text-zinc-100 text-md font-semibold w-[120px] min-w-[120px]">
                    {item.athDate}
                  </td>
                  <td className="text-right py-3 text-zinc-100 text-md font-semibold w-[120px] min-w-[120px]">
                    {`$${item.athPotentialValue.toFixed(2)}`}
                  </td>
                  <td className="text-right py-3 text-zinc-100 text-md font-semibold w-[120px] min-w-[120px]">
                    <span className={item.athPercentChange < 0 ? "text-red-500" : "text-green-500"}>
                      {item.athPercentChange.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
              {/* Fila de total */}
              <tr className="border-t-2 border-zinc-600">
                <td className="py-4 text-zinc-100 text-md font-bold w-[180px] min-w-[180px]">TOTAL</td>
                <td className="text-right py-4 w-[120px] min-w-[120px]"></td>
                <td className="text-right py-4 w-[120px] min-w-[120px]"></td>
                <td className="text-right py-4 w-[120px] min-w-[120px]"></td>
                <td className="text-right py-4 text-zinc-100 text-md font-bold bg-green-700/30 w-[120px] min-w-[120px]">
                  ${totalAthValue.toFixed(2)}
                </td>
                <td className="text-right py-4 w-[120px] min-w-[120px]"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AthClientComponent;
