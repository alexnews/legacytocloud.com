import type {
  ArticlesBySource,
  WeeklyNewsSummary,
  StockSymbol,
  StockReturn,
} from '@/types/analytics';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api';

async function fetchAnalytics<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}/analytics${endpoint}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Analytics API error: ${res.status}`);
  }
  return res.json();
}

export function getArticlesBySource(): Promise<ArticlesBySource[]> {
  return fetchAnalytics<ArticlesBySource[]>('/articles-by-source');
}

export function getWeeklyNewsSummary(): Promise<WeeklyNewsSummary[]> {
  return fetchAnalytics<WeeklyNewsSummary[]>('/weekly-summary');
}

export function getStockSymbols(): Promise<StockSymbol[]> {
  return fetchAnalytics<StockSymbol[]>('/stock-symbols');
}

export function getStockReturns(symbol: string): Promise<StockReturn[]> {
  return fetchAnalytics<StockReturn[]>(`/stock-returns?symbol=${symbol}`);
}
