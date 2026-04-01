'use client';

import { useEffect, useState, useCallback } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import {
  getArticlesBySource,
  getWeeklyNewsSummary,
  getStockSymbols,
} from '@/lib/analytics-api';
import type {
  ArticlesBySource,
  WeeklyNewsSummary,
  StockSymbol,
} from '@/types/analytics';

/* ---------- helpers ---------- */

function formatNum(n: number | null | undefined, decimals = 1): string {
  if (n == null) return '--';
  return n.toFixed(decimals);
}

function formatInt(n: number | null | undefined): string {
  if (n == null) return '--';
  return n.toLocaleString();
}

function formatDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return d;
  }
}

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}

/* ---------- skeleton ---------- */

function SectionSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-8 rounded bg-slate-800" />
      ))}
    </div>
  );
}

/* ---------- section: Articles by Source ---------- */

function ArticlesBySourceSection({ data }: { data: ArticlesBySource[] }) {
  const maxArticles = Math.max(...data.map((d) => d.total_articles), 1);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-700/60">
        <h2 className="text-base font-semibold text-white">Articles by Source</h2>
        <p className="text-xs text-slate-400 mt-0.5">Total articles, average quality, and image coverage per source</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-slate-700/40">
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium text-right">Articles</th>
              <th className="px-5 py-3 font-medium min-w-[180px]">Volume</th>
              <th className="px-5 py-3 font-medium text-right">Avg Quality</th>
              <th className="px-5 py-3 font-medium text-right">Avg Words</th>
              <th className="px-5 py-3 font-medium text-right">Avg Read</th>
              <th className="px-5 py-3 font-medium text-right">Image %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const pct = (row.total_articles / maxArticles) * 100;
              return (
                <tr
                  key={row.source}
                  className="border-b border-slate-700/20 hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-white whitespace-nowrap">
                    {row.source}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-300">
                    {formatInt(row.total_articles)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="w-full bg-slate-700/40 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    <span
                      className={
                        row.avg_quality_score != null && row.avg_quality_score >= 7
                          ? 'text-emerald-400'
                          : row.avg_quality_score != null && row.avg_quality_score >= 5
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }
                    >
                      {formatNum(row.avg_quality_score)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-300">
                    {formatInt(row.avg_word_count)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-300">
                    {row.avg_reading_time != null ? `${formatNum(row.avg_reading_time)} min` : '--'}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-300">
                    {row.image_coverage_pct != null ? `${formatNum(row.image_coverage_pct, 0)}%` : '--'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- section: Weekly News Volume ---------- */

function WeeklyVolumeSection({ data }: { data: WeeklyNewsSummary[] }) {
  const recent = data.slice(-20);
  const maxArticles = Math.max(...recent.map((d) => d.articles_published), 1);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-700/60">
        <h2 className="text-base font-semibold text-white">Weekly News Volume</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Articles published per week (last {recent.length} weeks)
        </p>
      </div>
      <div className="px-5 py-4">
        {/* Bar chart */}
        <div className="flex items-end gap-1.5" style={{ height: 180 }} role="img" aria-label="Weekly article volume bar chart">
          {recent.map((week) => {
            const heightPct = (week.articles_published / maxArticles) * 100;
            const weekLabel = new Date(week.week_start).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            return (
              <div
                key={week.week_start}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                {/* tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-xs shadow-xl whitespace-nowrap">
                    <div className="font-medium text-white">{weekLabel}</div>
                    <div className="text-slate-300 mt-0.5">{week.articles_published} articles</div>
                    <div className="text-slate-400">{week.unique_sources} sources</div>
                    {week.avg_quality != null && (
                      <div className="text-slate-400">Avg quality: {formatNum(week.avg_quality)}</div>
                    )}
                  </div>
                </div>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-300 hover:from-blue-500 hover:to-blue-300 cursor-pointer min-h-[2px]"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex gap-1.5 mt-2">
          {recent.map((week, i) => {
            const showLabel = recent.length <= 10 || i % Math.ceil(recent.length / 8) === 0 || i === recent.length - 1;
            return (
              <div key={week.week_start} className="flex-1 text-center">
                {showLabel && (
                  <span className="text-[10px] text-slate-500">
                    {new Date(week.week_start).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary row */}
        <div className="mt-5 pt-4 border-t border-slate-700/40 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white tabular-nums">
              {recent.reduce((s, w) => s + w.articles_published, 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Total Articles</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white tabular-nums">
              {formatNum(
                recent.reduce((s, w) => s + (w.avg_quality ?? 0), 0) / recent.filter((w) => w.avg_quality != null).length
              )}
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Avg Quality</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white tabular-nums">
              {Math.max(...recent.map((w) => w.unique_sources))}
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Peak Sources</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- section: Stock Symbols ---------- */

function StockSymbolsSection({ data }: { data: StockSymbol[] }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-700/60">
        <h2 className="text-base font-semibold text-white">Stock Symbols Summary</h2>
        <p className="text-xs text-slate-400 mt-0.5">Key metrics for tracked symbols from dbt marts</p>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((stock) => {
          const range = stock.all_time_high - stock.all_time_low;
          const positionPct = range > 0
            ? ((stock.latest_close - stock.all_time_low) / range) * 100
            : 50;

          return (
            <div
              key={stock.symbol}
              className="rounded-lg border border-slate-700/60 bg-slate-800 p-4 hover:border-slate-600 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-white">{stock.symbol}</span>
                <span className="text-xl font-semibold text-blue-400 tabular-nums">
                  {formatPrice(stock.latest_close)}
                </span>
              </div>

              {/* Price range bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>{formatPrice(stock.all_time_low)}</span>
                  <span>{formatPrice(stock.all_time_high)}</span>
                </div>
                <div className="relative w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500"
                    style={{ width: '100%' }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-blue-400 shadow-lg shadow-blue-400/30"
                    style={{ left: `${Math.min(Math.max(positionPct, 2), 98)}%`, transform: 'translate(-50%, -50%)' }}
                  />
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <span className="text-slate-500">Trading Days</span>
                  <div className="text-slate-200 font-medium tabular-nums">
                    {formatInt(stock.total_trading_days)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Avg Volume</span>
                  <div className="text-slate-200 font-medium tabular-nums">
                    {formatVolume(stock.avg_daily_volume)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">First Date</span>
                  <div className="text-slate-200 font-medium">{formatDate(stock.first_date)}</div>
                </div>
                <div>
                  <span className="text-slate-500">Last Date</span>
                  <div className="text-slate-200 font-medium">{formatDate(stock.last_date)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- section: Top Articles (from by-source data) ---------- */

function TopSourcesSection({ data }: { data: ArticlesBySource[] }) {
  const sorted = [...data].sort((a, b) => b.total_articles - a.total_articles);
  const totalArticles = sorted.reduce((s, d) => s + d.total_articles, 0);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-700/60">
        <h2 className="text-base font-semibold text-white">Source Distribution</h2>
        <p className="text-xs text-slate-400 mt-0.5">{totalArticles.toLocaleString()} total articles across {sorted.length} sources</p>
      </div>
      <div className="p-5 space-y-3">
        {sorted.map((row) => {
          const pct = totalArticles > 0 ? (row.total_articles / totalArticles) * 100 : 0;
          return (
            <div key={row.source}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-200 font-medium">{row.source}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 tabular-nums text-xs">{row.total_articles} articles</span>
                  <span className="text-slate-500 tabular-nums text-xs w-12 text-right">{pct.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-700/40 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export default function AnalyticsPage() {
  const [sources, setSources] = useState<ArticlesBySource[]>([]);
  const [weekly, setWeekly] = useState<WeeklyNewsSummary[]>([]);
  const [stocks, setStocks] = useState<StockSymbol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sourcesData, weeklyData, stocksData] = await Promise.all([
        getArticlesBySource(),
        getWeeklyNewsSummary(),
        getStockSymbols(),
      ]);
      setSources(sourcesData);
      setWeekly(weeklyData);
      setStocks(stocksData);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Unable to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            dbt Analytics
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="mt-3 text-slate-400 max-w-2xl">
            Aggregated insights from dbt mart tables — article performance by source, weekly publishing trends, and stock market summaries.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center mb-8">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={fetchData}
              className="mt-3 text-xs font-medium text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg px-4 py-2 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-8">
            {[5, 6, 3, 4].map((rows, i) => (
              <div key={i} className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
                <SectionSkeleton rows={rows} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Row 1: Articles table + Source distribution */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                {sources.length > 0 ? (
                  <ArticlesBySourceSection data={sources} />
                ) : (
                  <EmptyState label="No article source data available." />
                )}
              </div>
              <div>
                {sources.length > 0 ? (
                  <TopSourcesSection data={sources} />
                ) : (
                  <EmptyState label="No source distribution data available." />
                )}
              </div>
            </div>

            {/* Row 2: Weekly volume */}
            {weekly.length > 0 ? (
              <WeeklyVolumeSection data={weekly} />
            ) : (
              <EmptyState label="No weekly news data available." />
            )}

            {/* Row 3: Stock symbols */}
            {stocks.length > 0 ? (
              <StockSymbolsSection data={stocks} />
            ) : (
              <EmptyState label="No stock symbol data available." />
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-10 text-center">
      <svg
        className="w-12 h-12 text-slate-600 mx-auto mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );
}
