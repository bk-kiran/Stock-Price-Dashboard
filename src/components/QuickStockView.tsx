import type { StockData } from '../types/stock';

interface QuickStockViewProps {
  stock: StockData | null;
  searchQuery: string;
}

export const QuickStockView = ({ stock, searchQuery }: QuickStockViewProps) => {
  if (!stock || !searchQuery.trim()) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getChangeBgColor = (change: number) => {
    if (change > 0) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (change < 0) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  };

  const TrendIcon = ({ change }: { change: number }) => {
    if (change > 0) {
      return (
        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    }
    if (change < 0) {
      return (
        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  };

  return (
    <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {stock.symbol.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stock.symbol}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quick View</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatPrice(stock.price)}
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${getChangeBgColor(stock.changePercent)} ${getChangeColor(stock.changePercent)} border`}>
              <TrendIcon change={stock.changePercent} />
              <span className="text-sm font-semibold">
                {formatPercent(stock.changePercent)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-blue-200 dark:border-blue-800">
          <div className="bg-white/60 dark:bg-gray-700/60 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">$ Change</p>
            <p className={`text-lg font-bold ${getChangeColor(stock.change)}`}>
              {formatPrice(stock.change)}
            </p>
          </div>
          <div className="bg-white/60 dark:bg-gray-700/60 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">% Change</p>
            <p className={`text-lg font-bold ${getChangeColor(stock.changePercent)}`}>
              {formatPercent(stock.changePercent)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

