import { getTrasactionsDashboard, getCryptorankData } from '@/lib/actions';
import { DashboardItem } from '@/lib/interface';

// Función asíncrona para obtener los datos de ATH
export async function getAthData() {
  try {
    // Obtener las criptomonedas del usuario
    const dashboardResult = await getTrasactionsDashboard();
    
    if (!dashboardResult.success || !dashboardResult.data || !Array.isArray(dashboardResult.data)) {
      return { success: false, error: "No se pudieron cargar los datos" };
    }
    
    const dashboard: DashboardItem[] = dashboardResult.data;
    
    // Extraer los tickers de las criptomonedas
    const tickers = dashboard.map(item => item.ticker).join(',');
    
    // Obtener datos de Cryptorank para estas criptomonedas
    const cryptorankResult = await getCryptorankData(tickers);
    
    if (!cryptorankResult.success || !cryptorankResult.data) {
      return { success: false, error: "No se pudieron cargar los datos de ATH" };
    }
    
    // Combinar los datos del dashboard con los datos de ATH
    const combinedData = dashboard.map(dashboardItem => {
      const cryptoData = cryptorankResult.data?.data.find(
        crypto => crypto.symbol === dashboardItem.ticker
      );
      
      return {
        ...dashboardItem,
        ath: cryptoData?.ath?.value ? parseFloat(cryptoData.ath.value) : null,
        athDate: cryptoData?.ath?.date ? new Date(cryptoData.ath.date).toLocaleDateString() : null,
        athPercentChange: cryptoData?.ath?.percentChange ? parseFloat(cryptoData.ath.percentChange) : null
      };
    });
    
    return { success: true, data: combinedData };
  } catch (error) {
    console.error("Error al obtener datos de ATH:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al obtener datos de ATH"
    };
  }
}

// Componente Server para obtener los datos de ATH
const AthServerComponent = async () => {
  const result = await getAthData();
  return result;
};

export default AthServerComponent;
