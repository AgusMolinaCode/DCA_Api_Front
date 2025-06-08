const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * Función para hacer scraping de los ATH (All-Time High) de las primeras 5 criptomonedas desde CoinGecko
 * usando Puppeteer para simular un navegador real
 */
async function scrapeTopCryptoATH() {
  let browser = null;
  
  try {
    console.log('Iniciando scraping de datos ATH de las primeras 5 criptomonedas con Puppeteer...');
    
    // Lanzar navegador
    browser = await puppeteer.launch({
      headless: "new", // Usar el nuevo modo headless
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Configurar el user agent para simular un navegador real
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Configurar viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navegar a la página
    console.log('Navegando a la página de CoinGecko...');
    await page.goto('https://www.coingecko.com/en/highlights/all-time-high-crypto', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    console.log('Página cargada. Extrayendo datos...');
    
    // Esperar a que la tabla se cargue
    await page.waitForSelector('table tbody tr', { timeout: 30000 });
    
    // Extraer datos de las primeras 5 filas
    const cryptoATHData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr')).slice(0, 5);
      
      return rows.map(row => {
        const columns = row.querySelectorAll('td');
        
        // Obtener el ranking
        const rank = columns[0].textContent.trim();
        
        // Obtener nombre y símbolo
        const nameElement = columns[1];
        const name = nameElement.querySelector('span.tw-hidden')?.textContent.trim() || '';
        const symbolElement = nameElement.querySelector('span.tw-text-gray-500');
        const symbol = symbolElement ? symbolElement.textContent.trim().replace(/[()]/g, '') : '';
        
        // Obtener precio actual
        const currentPrice = columns[2].textContent.trim();
        
        // Obtener precio ATH
        const athPrice = columns[3].textContent.trim();
        
        // Obtener porcentaje desde ATH
        const percentFromATH = columns[4].textContent.trim();
        
        // Obtener fecha de ATH
        const athDate = columns[5].textContent.trim();
        
        return {
          rank,
          name,
          symbol,
          currentPrice,
          athPrice,
          percentFromATH,
          athDate
        };
      });
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
  } finally {
    // Cerrar el navegador
    if (browser) {
      await browser.close();
      console.log('Navegador cerrado.');
    }
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
