const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

/**
 * Función para hacer scraping de los ATH (All-Time High) de las primeras 5 criptomonedas desde CoinGecko
 */
async function scrapeTopCryptoATH() {
  try {
    console.log('Iniciando scraping de datos ATH de las primeras 5 criptomonedas...');
    
    const url = 'https://www.coingecko.com/en/highlights/all-time-high-crypto';
    
    // Configurar headers para simular un navegador
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0'
    };
    
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    
    const cryptoATHData = [];
    
    // Seleccionar las filas de la tabla (solo las primeras 5)
    $('table tbody tr').slice(0, 5).each((index, row) => {
      try {
        // Extraer los datos de cada columna
        const columns = $(row).find('td');
        
        // Obtener el ranking
        const rank = $(columns[0]).text().trim();
        
        // Obtener nombre y símbolo
        const nameElement = $(columns[1]);
        const name = nameElement.find('span.tw-hidden').text().trim();
        const symbol = nameElement.find('span.tw-text-gray-500').text().trim().replace(/[()]/g, '');
        
        // Obtener precio actual
        const currentPrice = $(columns[2]).text().trim();
        
        // Obtener precio ATH
        const athPrice = $(columns[3]).text().trim();
        
        // Obtener porcentaje desde ATH
        const percentFromATH = $(columns[4]).text().trim();
        
        // Obtener fecha de ATH
        const athDate = $(columns[5]).text().trim();
        
        cryptoATHData.push({
          rank,
          name,
          symbol,
          currentPrice,
          athPrice,
          percentFromATH,
          athDate
        });
        
      } catch (err) {
        console.error(`Error procesando fila ${index}:`, err.message);
      }
    });
    
    console.log(`Scraping completado. Se obtuvieron datos de ${cryptoATHData.length} criptomonedas.`);
    console.log(cryptoATHData);
    
    // Guardar los datos en un archivo JSON
    const outputPath = path.join(__dirname, '../data/top5_crypto_ath.json');
    
    // Asegurarse de que el directorio data exista
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Guardar los datos en formato JSON
    await fs.writeFile(outputPath, JSON.stringify(cryptoATHData, null, 2), 'utf8');
    console.log(`Datos guardados en: ${outputPath}`);
    
    return cryptoATHData;
  } catch (error) {
    console.error('Error durante el scraping:', error.message);
    throw error;
  }
}

// Ejecutar la función de scraping
scrapeTopCryptoATH()
  .then(data => {
    console.log('Datos de ATH obtenidos exitosamente:');
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('Error al obtener datos de ATH:', error);
  });
