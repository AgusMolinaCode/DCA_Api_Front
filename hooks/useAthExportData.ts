import { useMemo } from 'react';

// Tipo para los datos combinados del ATH
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

export const useAthExportData = (data: CombinedData[]) => {
  const exportData = useMemo(() => {
    return data.map(item => ({
      'Criptomoneda': item.crypto_name,
      'Ticker': item.ticker,
      'Precio Actual (USD)': item.current_price.toFixed(2),
      'ATH (USD)': item.ath.toFixed(2),
      'Fecha ATH': item.athDate,
      'Valor en ATH (USD)': item.athPotentialValue.toFixed(2),
      '% desde ATH': item.athPercentChange.toFixed(2) + '%',
      'Holdings': item.holdings.toFixed(8),
      'Precio Promedio (USD)': item.avg_price.toFixed(2),
      'Total Invertido (USD)': item.total_invested.toFixed(2),
      'Ganancia/Pérdida Actual (USD)': item.current_profit.toFixed(2),
      '% Ganancia/Pérdida': item.profit_percent.toFixed(2) + '%'
    }));
  }, [data]);

  return exportData;
};
