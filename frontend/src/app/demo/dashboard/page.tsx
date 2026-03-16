'use client';

import { useEffect, useState, useCallback } from 'react';
import type {
  Symbol,
  StockWithChange,
  StockOHLCV,
  MovingAverages,
  VolumeAnalysis,
  PipelineHealth,
  PipelineMetrics,
  PipelineRun,
} from '@/types/pipeline';
import {
  getHealth,
  getMetrics,
  getStocks,
  getStockOHLCV,
  getStockAnalytics,
  getStockVolume,
  getRuns,
} from '@/lib/pipeline-api';
import StockSummaryCards from '@/components/pipeline/StockSummaryCards';
import SymbolPicker from '@/components/pipeline/SymbolPicker';
import PriceChart from '@/components/pipeline/PriceChart';
import VolumeChart from '@/components/pipeline/VolumeChart';
import TechnicalIndicators from '@/components/pipeline/TechnicalIndicators';
import PipelineHealthPanel from '@/components/pipeline/PipelineHealthPanel';

const TIME_RANGES = [
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '180D', days: 180 },
  { label: '1Y', days: 365 },
] as const;

export default function DashboardPage() {
  const [symbol, setSymbol] = useState<Symbol>('AAPL');
  const [days, setDays] = useState(90);

  const [stocks, setStocks] = useState<StockWithChange[]>([]);
  const [ohlcv, setOhlcv] = useState<StockOHLCV[]>([]);
  const [analytics, setAnalytics] = useState<MovingAverages[]>([]);
  const [volume, setVolume] = useState<VolumeAnalysis[]>([]);
  const [health, setHealth] = useState<PipelineHealth>();
  const [metrics, setMetrics] = useState<PipelineMetrics>();
  const [runs, setRuns] = useState<PipelineRun[]>([]);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [loadingHealth, setLoadingHealth] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const data = await getStocks();
      setStocks(data);
    } catch (err) {
      console.error('Failed to fetch stocks:', err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const fetchCharts = useCallback(async () => {
    setLoadingCharts(true);
    try {
      const [ohlcvData, analyticsData, volumeData] = await Promise.all([
        getStockOHLCV(symbol, days),
        getStockAnalytics(symbol, days),
        getStockVolume(symbol, days),
      ]);
      setOhlcv(ohlcvData);
      setAnalytics(analyticsData);
      setVolume(volumeData);
    } catch (err) {
      console.error('Failed to fetch chart data:', err);
    } finally {
      setLoadingCharts(false);
    }
  }, [symbol, days]);

  const fetchHealth = useCallback(async () => {
    setLoadingHealth(true);
    try {
      const [h, m, r] = await Promise.all([getHealth(), getMetrics(), getRuns()]);
      setHealth(h);
      setMetrics(m);
      setRuns(r);
    } catch (err) {
      console.error('Failed to fetch health:', err);
    } finally {
      setLoadingHealth(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    fetchHealth();
  }, [fetchSummary, fetchHealth]);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Finance Analytics</h1>
            <p className="text-xs text-slate-400">Real-time stock data pipeline dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/demo/architecture"
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              View Architecture
            </a>
            <a
              href="/"
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              Home
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl p-6">
        <div className="lg:flex lg:gap-6">
          <div className="flex-1 space-y-6">
            <StockSummaryCards stocks={stocks} loading={loadingSummary} />

            <div className="flex flex-wrap items-center gap-4">
              <SymbolPicker selected={symbol} onSelect={setSymbol} />

              <div className="flex gap-1 rounded-lg bg-slate-800/60 p-1" role="group" aria-label="Time range selector">
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => setDays(range.days)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      days === range.days
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingCharts ? (
              <div className="space-y-6">
                {[320, 224, 400].map((h, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border border-slate-700 bg-slate-800"
                    style={{ height: h }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <PriceChart data={ohlcv} analytics={analytics} symbol={symbol} />
                <VolumeChart data={volume} ohlcv={ohlcv} symbol={symbol} />
                <TechnicalIndicators data={analytics} symbol={symbol} />
              </div>
            )}
          </div>

          <aside className="mt-6 w-full shrink-0 lg:mt-0 lg:w-72 xl:w-80">
            <div className="sticky top-6">
              <PipelineHealthPanel
                health={health}
                metrics={metrics}
                runs={runs}
                loading={loadingHealth}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
