const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

/**
 * Función para obtener datos de ATH de criptomonedas usando la API de CoinGecko
 */
async function getCryptoATHData() {
  try {
    console.log('Obteniendo datos de criptomonedas desde la API de CoinGecko...');
    
    // Primero obtenemos la lista de las principales criptomonedas
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,  // Obtenemos las 100 principales
        page: 1,
        sparkline: false,
        locale: 'es'
      },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const coins = response.data;
    console.log(`Se encontraron ${coins.length} criptomonedas.`);
    
    // Array para almacenar los datos de ATH
    const athData = [];
    
    // Procesamos cada moneda para obtener su ATH
    for (const coin of coins) {
      // Añadimos un retraso para evitar exceder los límites de la API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      try {
        console.log(`Obteniendo datos detallados para ${coin.name} (${coin.symbol.toUpperCase()})...`);
        
        // Obtenemos datos detallados de la moneda que incluyen el ATH
        const coinDetails = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin.id}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false
          },
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        const { market_data } = coinDetails.data;
        
        if (market_data && market_data.ath && market_data.ath_date) {
          const athPrice = market_data.ath.usd;
          const athDate = market_data.ath_date.usd;
          const currentPrice = market_data.current_price.usd;
          
          // Calculamos el porcentaje desde el ATH
          const percentFromATH = ((currentPrice - athPrice) / athPrice * 100).toFixed(2);
          
          // Calculamos los días desde el ATH
          const athDateTime = new Date(athDate);
          const currentDateTime = new Date();
          const daysSinceATH = Math.floor((currentDateTime - athDateTime) / (1000 * 60 * 60 * 24));
          
          athData.push({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            current_price: currentPrice,
            ath_price: athPrice,
            ath_date: athDate,
            percent_from_ath: percentFromATH,
            days_since_ath: daysSinceATH,
            image: coin.image
          });
        }
      } catch (error) {
        console.error(`Error obteniendo datos para ${coin.name}:`, error.message);
      }
    }
    
    console.log(`Datos de ATH obtenidos para ${athData.length} criptomonedas.`);
    
    // Guardar los datos en un archivo JSON
    const outputPath = path.join(__dirname, '../data/crypto_ath_data.json');
    
    // Asegurarse de que el directorio data exista
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Guardar los datos en formato JSON
    await fs.writeFile(outputPath, JSON.stringify(athData, null, 2), 'utf8');
    console.log(`Datos guardados en: ${outputPath}`);
    
    return athData;
  } catch (error) {
    console.error('Error obteniendo datos de criptomonedas:', error.message);
    throw error;
  }
}

// Ejecutar la función
getCryptoATHData()
  .then(data => {
    console.log('Datos de ATH obtenidos exitosamente');
    // Mostrar los primeros 5 resultados como ejemplo
    console.log('Primeros 5 resultados:');
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
  })
  .catch(error => {
    console.error('Error al obtener datos de ATH:', error);
  });
