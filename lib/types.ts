// Definir la estructura de una criptomoneda para búsqueda y visualización
export interface Crypto {
  name: string;
  ticker: string;
  price: number;
  imageUrl?: string;
}

// Definir la estructura para los datos enviados al backend
export interface CryptoData {
  crypto_name: string;
  ticker: string;
  amount: number;
  purchase_price: number;
  total: number;
  date: string;
  note?: string;
  type: "compra" | "venta";
  added_manually: boolean;
  image_url: string;
} 