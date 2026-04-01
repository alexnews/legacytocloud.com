export interface ArticlesBySource {
  source: string;
  total_articles: number;
  avg_quality_score: number | null;
  avg_word_count: number | null;
  avg_reading_time: number | null;
  articles_with_images: number;
  image_coverage_pct: number | null;
}

export interface WeeklyNewsSummary {
  week_start: string;
  articles_published: number;
  unique_sources: number;
  avg_quality: number | null;
  avg_word_count: number | null;
  sources_list: string;
}

export interface StockSymbol {
  symbol: string;
  total_trading_days: number;
  first_date: string;
  last_date: string;
  all_time_low: number;
  all_time_high: number;
  latest_close: number;
  avg_daily_volume: number;
}

export interface StockReturn {
  symbol: string;
  trade_date: string;
  close_price: number;
  daily_return_pct: number | null;
  sma_5: number | null;
  sma_20: number | null;
  sma_50: number | null;
  daily_range: number | null;
}
