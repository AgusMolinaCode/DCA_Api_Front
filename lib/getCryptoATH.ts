"use server";

// Definir la interfaz para los datos de ATH
export interface CryptoATHData {
  rank: string;
  name: string;
  symbol: string;
  currentPrice: string;
  athPrice: string;
  percentFromATH: string;
  athDate: string;
}

// Base de datos ampliada con más criptomonedas
const cryptoATHDatabase: CryptoATHData[] = [
  {
    "rank": "1",
    "name": "Bitcoin",
    "symbol": "BTC",
    "currentPrice": "$105,604",
    "athPrice": "$111,814",
    "percentFromATH": "-5.3%",
    "athDate": "May 22, 2025"
  },
  {
    "rank": "2",
    "name": "Ethereum",
    "symbol": "ETH",
    "currentPrice": "$2,515.79",
    "athPrice": "$4,878.26",
    "percentFromATH": "-48.3%",
    "athDate": "Nov 10, 2021"
  },
  {
    "rank": "3",
    "name": "Tether",
    "symbol": "USDT",
    "currentPrice": "$1.00",
    "athPrice": "$1.32",
    "percentFromATH": "-24.4%",
    "athDate": "Jul 24, 2018"
  },
  {
    "rank": "4",
    "name": "XRP",
    "symbol": "XRP",
    "currentPrice": "$2.17",
    "athPrice": "$3.40",
    "percentFromATH": "-35.8%",
    "athDate": "Jan 07, 2018"
  },
  {
    "rank": "5",
    "name": "BNB",
    "symbol": "BNB",
    "currentPrice": "$649.70",
    "athPrice": "$788.84",
    "percentFromATH": "-17.3%",
    "athDate": "Dec 04, 2024"
  },
  {
    "rank": "6",
    "name": "Solana",
    "symbol": "SOL",
    "currentPrice": "$148.23",
    "athPrice": "$259.96",
    "percentFromATH": "-43.0%",
    "athDate": "Nov 06, 2021"
  },
  {
    "rank": "7",
    "name": "Cardano",
    "symbol": "ADA",
    "currentPrice": "$0.45",
    "athPrice": "$3.09",
    "percentFromATH": "-85.4%",
    "athDate": "Sep 02, 2021"
  },
  {
    "rank": "8",
    "name": "Dogecoin",
    "symbol": "DOGE",
    "currentPrice": "$0.12",
    "athPrice": "$0.73",
    "percentFromATH": "-83.6%",
    "athDate": "May 08, 2021"
  },
  {
    "rank": "9",
    "name": "THORChain",
    "symbol": "RUNE",
    "currentPrice": "$7.25",
    "athPrice": "$20.87",
    "percentFromATH": "-65.3%",
    "athDate": "May 19, 2021"
  },
  {
    "rank": "10",
    "name": "Fetch.ai",
    "symbol": "FET",
    "currentPrice": "$1.85",
    "athPrice": "$2.74",
    "percentFromATH": "-32.5%",
    "athDate": "Mar 25, 2024"
  },
  {
    "rank": "11",
    "name": "Ronin",
    "symbol": "RONIN",
    "currentPrice": "$2.45",
    "athPrice": "$4.20",
    "percentFromATH": "-41.7%",
    "athDate": "Feb 15, 2024"
  },
  {
    "rank": "12",
    "name": "Bittensor",
    "symbol": "TAO",
    "currentPrice": "$458.32",
    "athPrice": "$598.75",
    "percentFromATH": "-23.5%",
    "athDate": "Apr 02, 2024"
  }
];

/**
 * Obtiene los datos de ATH (All-Time High) de criptomonedas
 * @param symbols Lista opcional de símbolos de criptomonedas para filtrar los resultados
 * @returns Datos de ATH de las criptomonedas solicitadas o todas si no se especifican símbolos
 */
export async function getCryptoATH(symbols?: string[]): Promise<CryptoATHData[]> {
  try {
    // Intentar leer los datos del archivo JSON si existe
    let athData: CryptoATHData[] = [];
    
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'data', 'top5_crypto_ath.json');
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        athData = JSON.parse(data);
      } else {
        // Si no existe el archivo, usar la base de datos en memoria
        athData = [...cryptoATHDatabase];
      }
    } catch (fsError) {
      console.error('Error al leer el archivo de datos ATH:', fsError);
      // En caso de error, usar la base de datos en memoria
      athData = [...cryptoATHDatabase];
    }
    
    // Si se proporcionan símbolos, filtrar los resultados
    if (symbols && symbols.length > 0) {
      // Convertir los símbolos a mayúsculas para comparación
      const upperSymbols = symbols.map(s => s.toUpperCase());
      
      // Filtrar los datos por los símbolos proporcionados
      const filteredData = athData.filter(crypto => 
        upperSymbols.includes(crypto.symbol.toUpperCase())
      );
      
      // Verificar si faltan algunos símbolos y crear entradas para ellos
      const missingSymbols = upperSymbols.filter(symbol => 
        !filteredData.some(crypto => crypto.symbol.toUpperCase() === symbol)
      );
      
      // Crear entradas para los símbolos faltantes con datos desconocidos
      const missingEntries = missingSymbols.map(symbol => ({
        rank: "N/A",
        name: symbol,
        symbol: symbol,
        currentPrice: "Desconocido",
        athPrice: "Desconocido",
        percentFromATH: "Desconocido",
        athDate: "Desconocido"
      }));
      
      return [...filteredData, ...missingEntries];
    }
    
    return athData;
  } catch (error) {
    console.error('Error al obtener datos de ATH', error);
    return [];
  }
}
