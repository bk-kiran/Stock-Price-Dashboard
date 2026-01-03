import type { StockData } from '../types/stock';

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || 'demo';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

const DEFAULT_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
  'DIS', 'JPM', 'V', 'MA', 'WMT', 'PG', 'JNJ', 'HD',
  'BAC', 'XOM', 'CVX', 'UNH'
];

export const fetchCompanyProfile = async (symbol: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.name || null; 
  } catch (error) {
    console.warn(`Could not fetch company name for ${symbol}:`, error);
    return null;
  }
};

export const fetchStockQuote = async (symbol: string, includeCompanyName: boolean = false): Promise<StockData | null> => {
  try {
    const url = `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    console.log(`🔍 Fetching: ${symbol}...`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API returned ${response.status} for ${symbol}:`, errorText);
      return null;
    }
    
    const data = await response.json();
    console.log(`📦 Response for ${symbol}:`, data);
    
    // Check for API errors in response
    if (data.error) {
      console.error(`❌ API error for ${symbol}:`, data.error);
      return null;
    }
    
    // Check if we have valid price data
    if (data.c === null || data.c === undefined) {
      console.warn(`⚠️ No price data for ${symbol} (market may be closed) - showing with $0.00`);
      // Return stock with 0 price instead of null so it still appears
      return {
        symbol,
        price: 0,
        change: data.d || 0,
        changePercent: data.dp || 0,
        timestamp: data.t || Date.now(),
      };
    }
    
    console.log(`✅ Successfully loaded ${symbol}: $${data.c}`);
    
    let companyName: string | undefined;
    if (includeCompanyName) {
      companyName = (await fetchCompanyProfile(symbol)) || undefined;
    }
    
    return {
      symbol,
      price: data.c || 0, // current price
      change: data.d || 0, // change
      changePercent: data.dp || 0, // change percent
      timestamp: data.t || Date.now(),
      companyName,
    };
  } catch (error) {
    console.error(`❌ Network/Error fetching quote for ${symbol}:`, error);
    return null;
  }
};

export const fetchMultipleStockQuotes = async (symbols: string[], includeCompanyNames: boolean = false): Promise<StockData[]> => {
  console.log(`📊 Fetching quotes for ${symbols.length} stocks...`);
  const promises = symbols.map(symbol => fetchStockQuote(symbol, includeCompanyNames));
  const results = await Promise.all(promises);
  const validStocks = results.filter((stock): stock is StockData => stock !== null);
  
  // Count stocks with valid prices vs zero prices (market closed)
  const stocksWithPrice = validStocks.filter(s => s.price > 0).length;
  const stocksWithZeroPrice = validStocks.filter(s => s.price === 0).length;
  
  // Debugging
  if (validStocks.length === 0 && symbols.length > 0) {
    console.warn(`⚠️ No valid stock data received for ${symbols.length} symbols. Check browser console for details.`);
    console.warn(`API Key being used: ${FINNHUB_API_KEY === 'demo' ? 'demo (limited)' : 'custom key'}`);
  } else {
    console.info(`✅ Loaded ${validStocks.length}/${symbols.length} stocks:`);
    console.info(`   - ${stocksWithPrice} with prices (market open)`);
    console.info(`   - ${stocksWithZeroPrice} with $0.00 (market closed)`);
    if (validStocks.length < symbols.length) {
      console.warn(`   - ${symbols.length - validStocks.length} failed to load`);
    }
  }
  
  return validStocks;
};

export const enrichStocksWithCompanyNames = async (stocks: StockData[]): Promise<StockData[]> => {
  // Add a small delay between requests to avoid rate limiting
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  const enrichedStocks: StockData[] = [];
  
  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i];
    
    if (stock.companyName) {
      enrichedStocks.push(stock); // Already has name
      continue;
    }
    
    try {
      if (i > 0) {
        await delay(1100); // 1.1 seconds between calls to stay under 60/min
      }
      
      const companyName = await fetchCompanyProfile(stock.symbol);
      enrichedStocks.push({ ...stock, companyName: companyName || undefined });
    } catch (error) {
      console.warn(`Failed to fetch company name for ${stock.symbol}:`, error);
      enrichedStocks.push(stock);
    }
  }
  
  return enrichedStocks;
};

export const getDefaultSymbols = () => DEFAULT_SYMBOLS;

