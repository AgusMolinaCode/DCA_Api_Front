import { getTrasactionsDashboard, getCryptorankData } from '@/lib/actions';
import { DashboardItem } from '@/lib/interface';
import { Suspense } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AthClientComponent from './AthClientComponent';

// Componente de carga
const AthLoader = () => (
  <Card>
    <CardHeader>
      <CardTitle>ATH (All-Time High)</CardTitle>
      <CardDescription>Cargando datos...</CardDescription>
    </CardHeader>
  </Card>
);

// Componente principal (server component)
const AthComponent = async () => {
  try {
    // Obtener las criptomonedas del usuario
    const dashboardResult = await getTrasactionsDashboard();
    
    if (!dashboardResult.success || !dashboardResult.data || !Array.isArray(dashboardResult.data)) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>ATH (All-Time High)</CardTitle>
            <CardDescription>No se pudieron cargar los datos del dashboard</CardDescription>
          </CardHeader>
        </Card>
      );
    }
    
    const dashboard: DashboardItem[] = dashboardResult.data;
    
    // Extraer los tickers de las criptomonedas
    const tickers = dashboard.map(item => item.ticker).join(',');
    
    // Obtener datos de Cryptorank para estas criptomonedas
    const cryptorankResult = await getCryptorankData(tickers);
    
    if (!cryptorankResult.success || !cryptorankResult.data) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>ATH (All-Time High)</CardTitle>
            <CardDescription>No se pudieron cargar los datos de ATH</CardDescription>
          </CardHeader>
        </Card>
      );
    }
    
    // Combinar los datos del dashboard con los datos de ATH
    const combinedData = dashboard.map(dashboardItem => {
      const cryptoData = cryptorankResult.data?.data.find(
        crypto => crypto.symbol === dashboardItem.ticker
      );
      
      // Si hay datos de ATH, usarlos; si no, usar precio actual como ATH
      const athValue = cryptoData?.ath?.value ? parseFloat(cryptoData.ath.value) : dashboardItem.current_price;
      const athDate = cryptoData?.ath?.date ? new Date(cryptoData.ath.date).toLocaleDateString() : new Date().toLocaleDateString();
      const athPercentChange = cryptoData?.ath?.percentChange ? parseFloat(cryptoData.ath.percentChange) : 0;
      
      // Calcular valor potencial en ATH
      const athPotentialValue = dashboardItem.holdings * athValue;
      
      return {
        ...dashboardItem,
        ath: athValue,
        athDate: athDate,
        athPercentChange: athPercentChange,
        athPotentialValue: athPotentialValue
      };
    });
    
    // Pasar los datos combinados al componente cliente
    return (
      <Suspense fallback={<AthLoader />}>
        <AthClientComponent data={combinedData} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error en AthComponent:", error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>ATH (All-Time High)</CardTitle>
          <CardDescription>Error al procesar los datos: {error instanceof Error ? error.message : "Error desconocido"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }
};

export default AthComponent;