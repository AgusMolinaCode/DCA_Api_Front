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
    user_id?: string;
    crypto_name: string;
    ticker: string;
    amount: number;
    purchase_price: number;
    total: number;
    date: string;
    created_at?: string;
    type: "compra" | "venta";
    note?: string;
    image_url?: string;
  }
  
  export interface TransactionWithPerformance {
    transaction: Transaction;
    current_price: number;
    current_value: number;
    gain_loss: number;
    gain_loss_percent: number;
  }
  
  export interface TransactionListProps {
    transactions: TransactionWithPerformance[];
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