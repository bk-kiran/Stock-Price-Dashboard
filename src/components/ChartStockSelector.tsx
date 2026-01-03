import type { StockData } from '../types/stock';

interface ChartStockSelectorProps {
  allStocks: StockData[];
  selectedStocks: string[];
  onSelectionChange: (selected: string[]) => void;
  maxSelection?: number;
}

export const ChartStockSelector = ({
  allStocks,
  selectedStocks,
  onSelectionChange,
  maxSelection = 8,
}: ChartStockSelectorProps) => {
  const handleToggle = (symbol: string) => {
    if (selectedStocks.includes(symbol)) {
      // Remove from selection
      onSelectionChange(selectedStocks.filter((s) => s !== symbol));
    } else {
      // Add to selection if under max
      if (selectedStocks.length < maxSelection) {
        onSelectionChange([...selectedStocks, symbol]);
      }
    }
  };

  const handleSelectAll = () => {
    const topStocks = allStocks
      .slice(0, maxSelection)
      .map((stock) => stock.symbol);
    onSelectionChange(topStocks);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl border border-blue-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Select Stocks for Chart
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Choose up to {maxSelection} stocks to display ({selectedStocks.length}/{maxSelection} selected)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors border border-blue-300 dark:border-gray-600"
          >
            Select Top {maxSelection}
          </button>
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {allStocks.map((stock) => {
          const isSelected = selectedStocks.includes(stock.symbol);
          const isDisabled = !isSelected && selectedStocks.length >= maxSelection;
          
          return (
            <button
              key={stock.symbol}
              onClick={() => handleToggle(stock.symbol)}
              disabled={isDisabled}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-semibold transition-all
                ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600'
                }
                ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer'
                }
              `}
            >
              <div className="flex items-center gap-1.5">
                {isSelected && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {stock.symbol}
              </div>
            </button>
          );
        })}
      </div>
      {selectedStocks.length === 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Select at least one stock to display in the chart
        </p>
      )}
    </div>
  );
};

