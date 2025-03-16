export interface Crypto {
    name: string;
    ticker: string;
    price: number;
    imageUrl?: string;
  }
  
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

  export interface Transaction {
    id: string;
    crypto_name: string;
    ticker: string;
    amount: number;
    purchase_price: number;
    image_url?: string;
    date: string;
    type: "compra" | "venta";
    note?: string;
  }
  
  export interface TransactionListProps {
    transactions: Transaction[];
  }

  export interface DashboardItem {
    ticker: string;
    total_invested: number;
    holdings: number;
    avg_price: number;
    current_price: number;
    current_profit: number;
    profit_percent: number;
    image_url: string;
    crypto_name: string;
  }
  
  export interface DashboardData {   
    dashboard: DashboardItem[];
  }