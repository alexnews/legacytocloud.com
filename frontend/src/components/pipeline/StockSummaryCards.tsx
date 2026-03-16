'use client';

import type { StockWithChange } from '@/types/pipeline';
import { SYMBOL_COLORS, type Symbol } from '@/types/pipeline';
import MetricCard from './MetricCard';

interface StockSummaryCardsProps {
  stocks: StockWithChange[];
  loading?: boolean;
}

export default function StockSummaryCards({ stocks, loading = false }: StockSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCard key={i} label="" value="" loading />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stocks.map((stock) => {
        const sym = stock.symbol as Symbol;
        const color = SYMBOL_COLORS[sym] || '#64748b';

        return (
          <MetricCard
            key={stock.symbol}
            label={stock.symbol}
            value={stock.latest_price}
            change={stock.daily_change_pct}
            accentColor={color}
            icon={
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            }
          />
        );
      })}
    </div>
  );
}
