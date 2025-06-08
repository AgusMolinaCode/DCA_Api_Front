const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Configuración
const CONFIG = {
  DELAY_BETWEEN_REQUESTS: 3000,  // 3 segundos entre solicitudes
  MAX_RETRIES: 3,                // Número máximo de reintentos
  RETRY_DELAY: 5000,             // 5 segundos de espera entre reintentos
  COINS_PER_BATCH: 10,           // Procesar monedas en lotes pequeños
  BATCH_DELAY: 60000,            // 1 minuto entre lotes
  OUTPUT_PATH: path.join(__dirname, '../data/crypto_ath_data.json')
};

/**
 * Realiza una solicitud HTTP con reintentos
 */
async function makeRequestWithRetry(url, params = {}, headers = {}) {
  let retries = 0;
  
  while (retries <= CONFIG.MAX_RETRIES) {
    try {
      const response = await axios.get(url, { params, headers });
      return response.data;
    } catch (error) {
      retries++;
      console.log(`Intento ${retries}/${CONFIG.MAX_RETRIES + 1} fallido: ${error.message}`);
      
      if (retries > CONFIG.MAX_RETRIES) {
        throw error;
      }
      
      // Esperar antes de reintentar
      console.log(`Esperando ${CONFIG.RETRY_DELAY / 1000} segundos antes de reintentar...`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
    }
  }
}

/**
 * Función para obtener datos de ATH de criptomonedas usando la API de CoinGecko
 */
async function getCryptoATHData() {
  try {
    console.log('Obteniendo datos de criptomonedas desde la API de CoinGecko...');
    
    // Headers para simular un navegador
    const headers = {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    // Primero obtenemos la lista de las principales criptomonedas
    const coins = await makeRequestWithRetry('https://api.coingecko.com/api/v3/coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 50,  // Reducimos a 50 para evitar demasiadas solicitudes
      page: 1,
      sparkline: false
    }, headers);
    
    console.log(`Se encontraron ${coins.length} criptomonedas.`);
    
    // Array para almacenar los datos de ATH
    const athData = [];
    let existingData = [];
    
    // Verificar si ya existe un archivo de datos para continuar desde ahí
    try {
      const fileData = await fs.readFile(CONFIG.OUTPUT_PATH, 'utf8');
      existingData = JSON.parse(fileData);
      console.log(`Se cargaron ${existingData.length} registros existentes.`);
      athData.push(...existingData);
    } catch (error) {
      console.log('No se encontraron datos existentes o el archivo no es válido.');
    }
    
    // Filtrar monedas que ya hemos procesado
    const existingIds = new Set(existingData.map(item => item.id));
    const coinsToProcess = coins.filter(coin => !existingIds.has(coin.id));
    
    console.log(`Procesando ${coinsToProcess.length} nuevas criptomonedas...`);
    
    // Dividir en lotes para procesar
    for (let i = 0; i < coinsToProcess.length; i += CONFIG.COINS_PER_BATCH) {
      const batch = coinsToProcess.slice(i, i + CONFIG.COINS_PER_BATCH);
      
      console.log(`Procesando lote ${Math.floor(i / CONFIG.COINS_PER_BATCH) + 1}/${Math.ceil(coinsToProcess.length / CONFIG.COINS_PER_BATCH)}`);
      
      // Procesar cada moneda en el lote actual
      for (const coin of batch) {
        try {
          console.log(`Obteniendo datos detallados para ${coin.name} (${coin.symbol.toUpperCase()})...`);
          
          // Esperar entre solicitudes para evitar límites de tasa
          await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_REQUESTS));
          
          // Obtenemos datos detallados de la moneda que incluyen el ATH
          const coinDetails = await makeRequestWithRetry(
            `https://api.coingecko.com/api/v3/coins/${coin.id}`, 
            {
              localization: false,
              tickers: false,
              market_data: true,
              community_data: false,
              developer_data: false,
              sparkline: false
            }, 
            headers
          );
          
          const { market_data } = coinDetails;
          
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
            
            const coinData = {
              id: coin.id,
              name: coin.name,
              symbol: coin.symbol.toUpperCase(),
              current_price: currentPrice,
              ath_price: athPrice,
              ath_date: athDate,
              percent_from_ath: percentFromATH,
              days_since_ath: daysSinceATH,
              image: coin.image
            };
            
            athData.push(coinData);
            
            // Guardar progreso después de cada moneda procesada
            await fs.mkdir(path.dirname(CONFIG.OUTPUT_PATH), { recursive: true });
            await fs.writeFile(CONFIG.OUTPUT_PATH, JSON.stringify(athData, null, 2), 'utf8');
            console.log(`Datos guardados para ${coin.name}`);
          }
        } catch (error) {
          console.error(`Error obteniendo datos para ${coin.name}:`, error.message);
        }
      }
      
      // Si hay más lotes por procesar, esperar entre lotes
      if (i + CONFIG.COINS_PER_BATCH < coinsToProcess.length) {
        console.log(`Esperando ${CONFIG.BATCH_DELAY / 1000} segundos antes del siguiente lote...`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.BATCH_DELAY));
      }
    }
    
    console.log(`Datos de ATH obtenidos para ${athData.length} criptomonedas.`);
    console.log(`Datos guardados en: ${CONFIG.OUTPUT_PATH}`);
    
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
