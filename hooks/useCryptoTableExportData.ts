import { useMemo } from 'react';
import { DashboardItem } from '@/lib/interface';

export const useCryptoTableExportData = (data: DashboardItem[]) => {
  const exportData = useMemo(() => {
    return data.map(item => ({
      'Criptomoneda': item.crypto_name,
      'Ticker': item.ticker,
      'Holdings': item.holdings.toFixed(8),
      'Precio Promedio (USD)': item.avg_price.toFixed(2),
      'Precio Actual (USD)': item.current_price.toFixed(2),
      'Total Invertido (USD)': item.total_invested.toFixed(2),
      'Valor Actual (USD)': (item.holdings * item.current_price).toFixed(2),
      'Ganancia/Pérdida (USD)': item.current_profit.toFixed(2),
      '% Ganancia/Pérdida': item.profit_percent.toFixed(2) + '%'
    }));
  }, [data]);

  return exportData;
};
