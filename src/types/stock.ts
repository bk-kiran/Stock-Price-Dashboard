export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp?: number;
  companyName?: string; // Full company name (e.g., "Apple Inc" for AAPL)
}

