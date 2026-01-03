# Stock Price Dashboard

A modern, responsive stock price dashboard built with React, TypeScript, and Tailwind CSS. Displays real-time stock data with interactive features including search, sorting, and chart visualization.

## Features

- 📊 **Stock Price Table** - Display stock symbols, prices, and percentage changes
- 🔍 **Search Functionality** - Filter stocks by symbol
- 📈 **Sortable Columns** - Click column headers to sort by symbol, price, change, or % change
- 📉 **Interactive Chart** - Visual representation of stock prices using Chart.js
- 🔄 **Auto-refresh** - Automatically updates data every 30 seconds
- ⚡ **Loading States** - Smooth loading indicators
- 🛡️ **Error Handling** - Graceful error messages with retry functionality
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Dark Mode Support** - Automatic dark mode based on system preferences

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Chart visualization library
- **Finnhub API** - Free stock market data API

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd stock
```

2. Install dependencies:
```bash
npm install
```

3. Set up API key (recommended):
   - Get a free API key from [Finnhub](https://finnhub.io)
   - Create a `.env` file in the root directory:
   ```env
   VITE_FINNHUB_API_KEY=your_api_key_here
   ```
   - Replace `your_api_key_here` with your actual API key from Finnhub

   **Note:** The app works with the demo API key (used if `.env` is not set), but it has rate limits. For production use, get your own free API key and add it to your `.env` file.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variable `VITE_FINNHUB_API_KEY` in Vercel dashboard
4. Deploy!

Vercel will automatically detect Vite and configure the build settings.

### Netlify

1. Push your code to GitHub
2. Import your repository on [Netlify](https://netlify.com)
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variable `VITE_FINNHUB_API_KEY` in Netlify dashboard
5. Deploy!

### GitHub Pages

1. Install `gh-pages` package:
```bash
npm install -D gh-pages
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://<your-username>.github.io/stock"
}
```

3. Deploy:
```bash
npm run deploy
```

**Note:** For GitHub Pages, you'll need to configure the base path in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/stock/', // Replace 'stock' with your repo name
  // ... other config
})
```

## Project Structure

```
stock/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx      # Main dashboard component
│   │   ├── StockTable.tsx      # Stock data table
│   │   ├── StockChart.tsx      # Chart visualization
│   │   ├── Loading.tsx         # Loading spinner
│   │   └── Error.tsx           # Error component
│   ├── services/
│   │   └── stockApi.ts         # API service
│   ├── types/
│   │   └── stock.ts            # TypeScript types
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## API Information

This project uses the [Finnhub API](https://finnhub.io) for stock market data.

- **Free Tier:** 60 API calls/minute
- **Rate Limits:** Be mindful of the rate limits when using the demo key
- **Get API Key:** Sign up at [finnhub.io](https://finnhub.io) for a free API key
- **Environment Variable:** Set `VITE_FINNHUB_API_KEY` in your `.env` file (see Getting Started section)

## Customization

### Adding More Stocks

**Yes, you can add as many stocks as you want!** There is **NO maximum limit** in the code. The table and chart will automatically display all stocks you add.

To add more stocks:

1. Edit `src/services/stockApi.ts` and modify the `DEFAULT_SYMBOLS` array:

```typescript
const DEFAULT_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
  'DIS', 'JPM', 'V', 'MA', 'WMT', 'PG', 'JNJ', 'HD', // Add more here
  'BAC', 'XOM', 'CVX', 'UNH', 'PFE', 'ABBV', 'KO', 'PEP'
];
```

2. The table and chart will automatically update to show all stocks you add.

**Important Notes:**
- **No code limit**: You can add 10, 20, 50, or even 100+ stocks - the UI will handle it
- **API Rate Limit**: The only constraint is the Finnhub API rate limit:
  - **Free tier**: 60 API calls per minute
  - If you add 20 stocks, that's 20 API calls per refresh
  - With auto-refresh every 30 seconds, you can safely display up to **30 stocks** (60 calls/min ÷ 2 refreshes/min = 30 stocks)
  - For more stocks, increase the refresh interval or upgrade your API plan
- **Performance**: The table and chart are optimized and will work smoothly with many stocks
- **Responsive**: The table is scrollable on mobile devices if you have many stocks

### Changing Refresh Interval

Edit `src/components/Dashboard.tsx` and modify the interval:

```typescript
const interval = setInterval(loadStocks, 30000); // 30000ms = 30 seconds
```

**Tip**: If you add many stocks (30+), consider increasing the refresh interval to avoid hitting API rate limits:
- 30 stocks: 30 seconds (current)
- 40 stocks: 45 seconds
- 50 stocks: 60 seconds (1 minute)

### Styling

The project uses Tailwind CSS. Customize colors, spacing, and other design tokens in `tailwind.config.js`.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
