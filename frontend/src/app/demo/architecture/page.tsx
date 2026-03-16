'use client';

import { useEffect, useState } from 'react';
import type { ArchitectureResponse } from '@/types/pipeline';
import { getArchitecture } from '@/lib/pipeline-api';
import ArchitectureDiagram from '@/components/pipeline/ArchitectureDiagram';

const FLOW_STEPS = [
  {
    step: 1,
    title: 'Data Ingestion',
    description: 'Python script fetches daily OHLCV data from Alpha Vantage for tracked symbols.',
    code: `# Fetch daily stock data
response = requests.get(
    "https://alphavantage.co/query",
    params={"function": "TIME_SERIES_DAILY", "symbol": symbol}
)
daily_data = response.json()["Time Series (Daily)"]`,
  },
  {
    step: 2,
    title: 'PostgreSQL Staging',
    description: 'Raw data is inserted into PostgreSQL as the OLTP staging layer with deduplication.',
    code: `-- Upsert raw stock prices
INSERT INTO stock_prices (symbol, trade_date, open, high, low, close, volume)
VALUES (%s, %s, %s, %s, %s, %s, %s)
ON CONFLICT (symbol, trade_date) DO UPDATE
SET open = EXCLUDED.open, close = EXCLUDED.close;`,
  },
  {
    step: 3,
    title: 'Analytics Transform',
    description: 'Python calculates technical indicators: moving averages, MACD, RSI, and volume analysis.',
    code: `# Calculate technical indicators with pandas
df["sma_20"] = df["close"].rolling(window=20).mean()
df["ema_12"] = df["close"].ewm(span=12).mean()
df["macd"] = df["ema_12"] - df["ema_26"]
df["rsi_14"] = compute_rsi(df["close"], period=14)`,
  },
  {
    step: 4,
    title: 'ClickHouse OLAP',
    description: 'Transformed analytics data is loaded into ClickHouse for fast columnar queries.',
    code: `-- ClickHouse MergeTree table for fast analytics
CREATE TABLE stock_analytics (
    symbol LowCardinality(String),
    trade_date Date,
    sma_20 Float64,
    rsi_14 Float64
) ENGINE = MergeTree()
ORDER BY (symbol, trade_date);`,
  },
  {
    step: 5,
    title: 'FastAPI Backend',
    description: 'REST API layer queries ClickHouse and serves data to the frontend with caching.',
    code: `@app.get("/api/pipeline/stocks/{symbol}/analytics")
async def get_analytics(symbol: str, days: int = 90):
    query = """
        SELECT * FROM stock_analytics
        WHERE symbol = {symbol:String}
        ORDER BY trade_date DESC LIMIT {days:UInt32}
    """
    return await clickhouse.execute(query)`,
  },
  {
    step: 6,
    title: 'Next.js Dashboard',
    description: 'Interactive React dashboard renders charts with Chart.js and real-time data updates.',
    code: `// Fetch and render stock analytics
const [ohlcv, analytics, volume] = await Promise.all([
  getStockOHLCV(symbol, days),
  getStockAnalytics(symbol, days),
  getStockVolume(symbol, days),
]);
return <PriceChart data={ohlcv} analytics={analytics} />;`,
  },
];

export default function ArchitecturePage() {
  const [archData, setArchData] = useState<ArchitectureResponse | undefined>();

  useEffect(() => {
    getArchitecture()
      .then(setArchData)
      .catch(() => {
        /* Use default nodes from ArchitectureDiagram */
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Pipeline Architecture</h1>
            <p className="text-xs text-slate-400">End-to-end data pipeline from API to dashboard</p>
          </div>
          <a
            href="/demo/dashboard"
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
          >
            View Dashboard
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-screen-xl space-y-12 p-6">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">System Overview</h2>
          <p className="mb-6 max-w-2xl text-sm text-slate-400">
            Click any node to view details about its role in the pipeline. Data flows left to right
            from the Alpha Vantage API through ingestion, transformation, and analytics layers
            to the interactive dashboard.
          </p>
          <ArchitectureDiagram data={archData} />
        </section>

        <section>
          <h2 className="mb-6 text-lg font-semibold text-white">How Data Flows</h2>
          <div className="space-y-6">
            {FLOW_STEPS.map((step) => (
              <div
                key={step.step}
                className="flex gap-4 rounded-xl border border-slate-700 bg-slate-800 p-5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-400">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mb-3 text-sm text-slate-400">{step.description}</p>
                  <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-300">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-lg font-semibold text-white">Why This Architecture</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
              <h3 className="mb-2 text-sm font-semibold text-emerald-400">
                OLTP: PostgreSQL
              </h3>
              <p className="text-sm text-slate-400">
                PostgreSQL handles transactional workloads -- ingesting and deduplicating raw stock data
                with row-level ACID guarantees. Its upsert capability ensures data integrity during
                incremental loads, while serving as the pipeline metadata store for run tracking.
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
              <h3 className="mb-2 text-sm font-semibold text-blue-400">
                OLAP: ClickHouse
              </h3>
              <p className="text-sm text-slate-400">
                ClickHouse is a columnar database optimized for analytical queries. Scanning millions
                of rows for time-series aggregations, moving averages, and technical indicators runs
                10-100x faster than PostgreSQL. The MergeTree engine provides efficient compression
                and partition pruning for date-range queries.
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
              <h3 className="mb-2 text-sm font-semibold text-amber-400">
                Separation of Concerns
              </h3>
              <p className="text-sm text-slate-400">
                Keeping OLTP and OLAP databases separate prevents analytical queries from impacting
                ingestion performance. Each database is tuned for its workload -- PostgreSQL for writes
                and ClickHouse for reads. The Python transform layer bridges the two, computing derived
                metrics before loading into the analytics store.
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
              <h3 className="mb-2 text-sm font-semibold text-violet-400">
                Pipeline Observability
              </h3>
              <p className="text-sm text-slate-400">
                Every pipeline run is tracked with row counts, timing, and error messages. The health
                endpoint monitors both database connections and data freshness. The dashboard surfaces
                these metrics so operators can detect stale data or failed runs immediately without
                checking logs.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
