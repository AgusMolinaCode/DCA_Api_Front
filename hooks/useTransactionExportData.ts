import { useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const useTransactionExportData = (data: any[]) => {
  const exportData = useMemo(() => {
    return data.map(item => ({
      'Criptomoneda': item.transaction.crypto_name,
      'Ticker': item.transaction.ticker,
      'Tipo': item.transaction.type === 'compra' ? 'Compra' : 'Venta',
      'Fecha': format(new Date(item.transaction.date), 'dd/MM/yyyy', { locale: es }),
      'Cantidad': item.transaction.amount.toFixed(8),
      'Precio Compra/Venta (USD)': item.transaction.purchase_price.toFixed(2),
      'Precio de Mercado (USD)': item.current_price.toFixed(2),
      'Total Invertido (USD)': item.transaction.total.toFixed(2),
      'Valor de Mercado (USD)': item.current_value.toFixed(2),
      'Ganancia/Pérdida (USD)': item.gain_loss.toFixed(2),
      '% Ganancia/Pérdida': item.gain_loss_percent.toFixed(2) + '%',
      'Nota': item.transaction.note || ''
    }));
  }, [data]);

  return exportData;
};