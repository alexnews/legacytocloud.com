export interface StockPrice {
  symbol: string;
  trade_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockWithChange {
  symbol: string;
  latest_price: number;
  daily_change: number;
  daily_change_pct: number;
  volume: number;
}

export interface StockOHLCV extends StockPrice {
  daily_return: number;
  intraday_range: number;
}

export interface MovingAverages {
  symbol: string;
  trade_date: string;
  sma_20: number;
  sma_50: number;
  ema_12: number;
  ema_26: number;
  macd: number;
  macd_signal: number;
  macd_histogram: number;
  rsi_14: number;
}

export interface VolumeAnalysis {
  symbol: string;
  trade_date: string;
  volume: number;
  avg_volume_20: number;
  volume_ratio: number;
}

export interface PipelineHealth {
  status: string;
  clickhouse_connected: boolean;
  postgres_connected: boolean;
  last_sync: string | null;
  total_rows: number;
  symbols_tracked: number;
}

export interface PipelineMetrics {
  total_rows: number;
  symbols: string[];
  last_sync: string | null;
  data_freshness_hours: number | null;
  pipeline_runs_24h: number;
  avg_transform_seconds: number | null;
}

export interface PipelineRun {
  id: number;
  run_type: string;
  status: string;
  rows_processed: number;
  rows_inserted: number;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
}

export interface ArchitectureNode {
  id: string;
  name: string;
  type: string;
  description: string;
  tech: string;
  metrics?: Record<string, any>;
}

export interface ArchitectureResponse {
  nodes: ArchitectureNode[];
  connections: Array<{ from: string; to: string; label: string }>;
}

export type Symbol = 'AAPL' | 'MSFT' | 'JPM' | 'GS';

export const SYMBOL_COLORS: Record<Symbol, string> = {
  AAPL: '#3b82f6',
  MSFT: '#10b981',
  JPM: '#f59e0b',
  GS: '#8b5cf6',
};

export const SYMBOL_NAMES: Record<Symbol, string> = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corp.',
  JPM: 'JPMorgan Chase',
  GS: 'Goldman Sachs',
};
