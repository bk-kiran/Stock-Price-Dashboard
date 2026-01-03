import type { StockData } from '../types/stock';

interface StockTableProps {
  stocks: StockData[];
  onSort: (field: keyof StockData) => void;
  sortField: keyof StockData | null;
  sortDirection: 'asc' | 'desc';
}

export const StockTable = ({ stocks, onSort, sortField, sortDirection }: StockTableProps) => {
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
    if (change > 0) return 'bg-green-50 dark:bg-green-900/20';
    if (change < 0) return 'bg-red-50 dark:bg-red-900/20';
    return 'bg-gray-50 dark:bg-gray-800';
  };

  const TrendIcon = ({ change }: { change: number }) => {
    if (change > 0) {
      return (
        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    }
    if (change < 0) {
      return (
        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  };

  const SortIcon = ({ field }: { field: keyof StockData }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return (
      <svg
        className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'text-blue-600' : 'text-blue-600 rotate-180'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  };

  if (stocks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No stocks found. Try searching for a different symbol.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <th
              onClick={() => onSort('symbol')}
              className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                Symbol
                <SortIcon field="symbol" />
              </div>
            </th>
            <th
              onClick={() => onSort('price')}
              className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                Price
                <SortIcon field="price" />
              </div>
            </th>
            <th
              onClick={() => onSort('change')}
              className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                $ Change
                <SortIcon field="change" />
              </div>
            </th>
            <th
              onClick={() => onSort('changePercent')}
              className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                % Change
                <SortIcon field="changePercent" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
          {stocks.map((stock, index) => (
            <tr
              key={stock.symbol}
              className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-gray-700/50 dark:hover:to-gray-700/50 transition-all duration-200 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-help">
                      {stock.symbol.charAt(0)}
                    </div>
                    {stock.companyName && (
                      <div className="absolute left-0 top-full mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap pointer-events-none">
                        {stock.companyName}
                        <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {stock.symbol}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Stock
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                {stock.price > 0 ? (
                  <div className="text-base font-bold text-gray-900 dark:text-white">
                    {formatPrice(stock.price)}
                  </div>
                ) : (
                  <div className="text-base font-bold text-gray-400 dark:text-gray-500 italic">
                    Market Closed
                  </div>
                )}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getChangeBgColor(stock.change)} ${getChangeColor(stock.change)}`}>
                  <TrendIcon change={stock.change} />
                  <span className="text-sm font-semibold">
                    {formatPrice(stock.change)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getChangeBgColor(stock.changePercent)} ${getChangeColor(stock.changePercent)}`}>
                  <TrendIcon change={stock.changePercent} />
                  <span className="text-sm font-semibold">
                    {formatPercent(stock.changePercent)}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

