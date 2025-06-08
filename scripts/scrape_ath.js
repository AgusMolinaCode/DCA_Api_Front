const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

/**
 * Función para hacer scraping de los ATH (All-Time High) de criptomonedas desde CoinGecko
 */
async function scrapeATHData() {
  try {
    console.log('Iniciando scraping de datos ATH de CoinGecko...');
    
    const url = 'https://www.coingecko.com/en/highlights/all-time-high-crypto';
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const cryptoATHData = [];
    
    // Selecciona los contenedores que tienen la información de las criptomonedas
    $('.coin-table tbody tr').each((index, element) => {
      try {
        // Extrae el nombre y símbolo de la criptomoneda
        const name = $(element).find('td:nth-child(2) .tw-hidden').text().trim();
        const symbol = $(element).find('td:nth-child(2) .tw-text-gray-500').text().trim().replace(/[()]/g, '');
        
        // Extrae la fecha de ATH
        const athDate = $(element).find('td:nth-child(3)').text().trim();
        
        // Extrae el precio ATH
        const athPrice = $(element).find('td:nth-child(4)').text().trim();
        
        // Extrae el porcentaje desde ATH
        const percentFromATH = $(element).find('td:nth-child(5)').text().trim();
        
        // Extrae los días desde ATH
        const daysSinceATH = $(element).find('td:nth-child(6)').text().trim();
        
        // Solo agrega entradas válidas
        if (name && symbol) {
          cryptoATHData.push({
            name,
            symbol,
            athDate,
            athPrice,
            percentFromATH,
            daysSinceATH
          });
        }
      } catch (err) {
        console.error(`Error procesando elemento ${index}:`, err.message);
      }
    });
    
    console.log(`Scraping completado. Se encontraron ${cryptoATHData.length} criptomonedas.`);
    
    // Guardar los datos en un archivo JSON
    const outputPath = path.join(__dirname, '../data/crypto_ath_data.json');
    
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
scrapeATHData()
  .then(data => {
    console.log('Datos de ATH obtenidos exitosamente');
    // Mostrar los primeros 5 resultados como ejemplo
    console.log('Primeros 5 resultados:');
    console.log(data.slice(0, 5));
  })
  .catch(error => {
    console.error('Error al obtener datos de ATH:', error);
  });
