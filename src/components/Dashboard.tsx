import { useState, useEffect, useCallback } from 'react';
import type { StockData } from '../types/stock';
import { fetchMultipleStockQuotes, getDefaultSymbols } from '../services/stockApi';
import { StockTable } from './StockTable';
import { StockChart } from './StockChart';
import { ChartStockSelector } from './ChartStockSelector';
import { QuickStockView } from './QuickStockView';
import { Loading } from './Loading';
import { Error } from './Error';

type SortField = keyof StockData;
type SortDirection = 'asc' | 'desc';

const isError = (err: unknown): err is Error => {
  return err instanceof Error;
};

const getErrorMessage = (err: unknown): string => {
  if (isError(err)) {
    return err.message;
  }
  return 'Failed to load stock data';
};

export const Dashboard = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showChart, setShowChart] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedChartStocks, setSelectedChartStocks] = useState<string[]>([]);

  const loadStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const symbols = getDefaultSymbols();
      const stockData = await fetchMultipleStockQuotes(symbols);
      
      if (stockData.length === 0) {
        const apiKey = import.meta.env.VITE_FINNHUB_API_KEY || 'demo';
        console.error('❌ No stocks loaded. Check console above for details.');
        console.error(`API Key status: ${apiKey === 'demo' ? 'Using DEMO key (limited)' : 'Using custom key'}`);
        console.error('Troubleshooting:');
        console.error('1. Open Network tab (F12) and check if API calls are being made');
        console.error('2. Check if API calls return 200 status or errors');
        console.error('3. Verify your .env file has VITE_FINNHUB_API_KEY set');
        console.error('4. Restart dev server after changing .env file');
        
        if (apiKey === 'demo') {
          setError('Demo API key has limited access and may be blocked. Please add your free API key from finnhub.io to your .env file as VITE_FINNHUB_API_KEY. Get a free key at: https://finnhub.io/register');
        } else {
          setError('No stock data available. Check browser console (F12) for detailed error messages. Possible issues: 1) API key invalid, 2) Network/CORS issue, 3) Rate limit exceeded, 4) Market closed. See console for API response details.');
        }
      } else {
        setStocks(stockData);
        setFilteredStocks(stockData);
        setLastUpdated(new Date());
        
        // Initialize chart selection with first 8 stocks if empty (only on first load)
        setSelectedChartStocks((prev) => {
          if (prev.length === 0) {
            return stockData.slice(0, 8).map((stock) => stock.symbol);
          }
          // Keep existing selection, but filter out any symbols that no longer exist
          return prev.filter((symbol) =>
            stockData.some((stock) => stock.symbol === symbol)
          );
        });
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStocks();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStocks, 30000);
    return () => clearInterval(interval);
  }, [loadStocks]);

  useEffect(() => {
    let filtered = stocks;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = stocks.filter((stock) =>
        stock.symbol.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === undefined || bValue === undefined) return 0;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        const numA = Number(aValue);
        const numB = Number(bValue);

        return sortDirection === 'asc' ? numA - numB : numB - numA;
      });
    }

    setFilteredStocks(filtered);
  }, [stocks, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading && stocks.length === 0) {
    return <Loading />;
  }

  if (error && stocks.length === 0) {
    return <Error message={error} onRetry={loadStocks} />;
  }

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Stock Market Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Real-time stock prices and market insights
              </p>
            </div>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
            </div>
          )}
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by symbol (e.g., AAPL, MSFT)..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-3 pl-11 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all"
              />
              <svg
                className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowChart(!showChart)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold flex items-center gap-2"
            >
              {showChart ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Hide Chart
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Show Chart
                </>
              )}
            </button>
            <button
              onClick={loadStocks}
              disabled={loading}
              className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Stock View - Shows when searching for a specific stock */}
        {searchQuery.trim() && (
          <QuickStockView
            stock={
              stocks.find(
                (stock) =>
                  stock.symbol.toUpperCase() === searchQuery.trim().toUpperCase()
              ) || null
            }
            searchQuery={searchQuery}
          />
        )}

        {error && stocks.length > 0 && (
          <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
            </div>
          </div>
        )}

        {/* Chart */}
        {showChart && stocks.length > 0 && (
          <div className="mb-6">
            <ChartStockSelector
              allStocks={stocks}
              selectedStocks={selectedChartStocks}
              onSelectionChange={setSelectedChartStocks}
              maxSelection={8}
            />
            {selectedChartStocks.length > 0 ? (
              <StockChart
                stocks={stocks.filter((stock) =>
                  selectedChartStocks.includes(stock.symbol)
                )}
              />
            ) : (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-12 h-96 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400 font-semibold">
                    Select stocks above to display in the chart
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stock Table */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Market Overview
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Live stock prices and performance metrics
              </p>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 rounded-xl border border-blue-200 dark:border-gray-600">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                {filteredStocks.length} {filteredStocks.length === 1 ? 'stock' : 'stocks'}
              </span>
            </div>
          </div>
          <StockTable
            stocks={filteredStocks}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
            <svg className="w-4 h-4 text-green-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="5" />
            </svg>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Auto-refresh every 30 seconds
            </p>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
            Powered by{' '}
            <a
              href="https://finnhub.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Finnhub API
            </a>
            {import.meta.env.VITE_FINNHUB_API_KEY ? ' • API key configured' : ' • Demo mode'}
          </p>
        </div>
      </div>
    </div>
  );
};

