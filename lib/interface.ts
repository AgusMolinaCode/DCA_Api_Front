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
    refreshTransactions?: () => void;
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

  export interface Chart {
    total_current_value: number;
    total_invested:      number;
    total_profit:        number;
    profit_percentage:   number;
    distribution:        Distribution[];
    chart_data:          ChartData;
}

export interface ChartData {
    labels:   string[];
    values:   number[];
    colors:   string[];
    currency: string;
}

export interface Distribution {
    ticker: string;
    name:   string;
    value:  number;
    weight: number;
    color:  string;
    is_others?: boolean;
    others_detail?: OthersDetail[];
}

export interface OthersDetail {
  ticker: string;
  name:   string;
  value:  number;
  weight: number;
}


export interface DashboardMainBalanceProps {
  profit_percentage:   number;
  total_current_value: number;
  total_invested:      number;
  total_profit:        number;
}

export interface PerformanceProps {
  performance: Performance;
}

export interface Performance {
  top_gainer: Top;
  top_loser:  Top;
}

export interface Top {
  ticker:             string;
  change_percent_24h: number;
  price_change:       number;
  image_url:          string;
}

// Interfaces para el historial de inversiones
export interface InvestmentHistoryParams {
  show_all?: boolean;
  show_7d?: boolean;
  show_30d?: boolean;
  show_today?: boolean;
}

export interface InvestmentHistoryResponse {
  investment_history: InvestmentHistory;
}

export interface InvestmentHistory {
  labels: string[];
  values: HistoryValue[];
  max_values: HistoryValue[];
  min_values: HistoryValue[];
  snapshots: InvestmentSnapshot[];
}

export interface HistoryValue {
  fecha: string;
  valor: number;
}

export interface InvestmentSnapshot {
  id: string;
  user_id: string;
  date: string;
  total_value: number;
  total_invested: number;
  profit: number;
  profit_percentage: number;
  max_value: number;
  min_value: number;
}

// Interfaces para bolsas de inversión
export interface BolsaAsset {
  id: string;
  bolsa_id: string;
  crypto_name: string;
  ticker: string;
  amount: number;
  image_url: string;
  purchase_price: number;
  total: number;
  current_price: number;
  current_value: number;
  gain_loss: number;
  gain_loss_percent: number;
  created_at: string;
  updated_at: string;
}

export interface BolsaProgress {
  percent: number;
  raw_percent: number;
  status: 'pendiente' | 'superado';
  excess_amount?: number;
  excess_percent?: number;
}

export interface Bolsa {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  goal: number;
  current_value: number;
  progress?: BolsaProgress;
  assets?: BolsaAsset[];
  created_at: string;
  updated_at: string;
}

export interface BolsasResponse {
  bolsas: Bolsa[];
}

export interface CreateBolsaData {
  name: string;
  description?: string;
  goal: number;
}

export interface CreateBolsaResponse {
  success: boolean;
  message?: string;
  bolsa?: Bolsa;
  error?: string;
}

export interface BolsaDetailsResponse {
  bolsa: Bolsa;
}

export interface AddAssetToBolsaResponse {
  added_assets: BolsaAsset[];
  bolsa: Bolsa;
  current_value: number;
  progress_percent: number;
  total_value_added: number;
}

// Interfaces para la API de Cryptorank
export interface CryptorankResponse {
  data: CryptorankCurrency[];
  status: {
    usedCredits: number;
  };
}

export interface CryptorankCurrency {
  id: number;
  key: string;
  symbol: string;
  name: string;
  type: string;
  rank: number;
  categoryId: number;
  lastUpdated: number;
  totalSupply: string;
  maxSupply: string | null;
  circulatingSupply: string;
  volume24hBase: string;
  images: {
    x60: string;
    x150: string;
    icon: string;
    native: string;
  };
  price: string;
  high24h: string;
  low24h: string;
  volume24h: string;
  marketCap: string;
  fullyDilutedValuation: string;
  ath: {
    date: number;
    value: string;
    percentChange: string;
  };
  atl: {
    date: number;
    value: string;
    percentChange: string;
  };
}
