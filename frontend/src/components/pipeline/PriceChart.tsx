'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import type { StockOHLCV, MovingAverages, Symbol } from '@/types/pipeline';
import { SYMBOL_COLORS } from '@/types/pipeline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  TimeScale,
);

interface PriceChartProps {
  data: StockOHLCV[];
  analytics?: MovingAverages[];
  symbol: Symbol;
}

export default function PriceChart({ data, analytics, symbol }: PriceChartProps) {
  const symbolColor = SYMBOL_COLORS[symbol];

  const chartData = useMemo(() => {
    const labels = data.map((d) => d.trade_date);

    const datasets: any[] = [
      {
        label: `${symbol} Close`,
        data: data.map((d) => d.close),
        borderColor: symbolColor,
        backgroundColor: (ctx: any) => {
          if (!ctx.chart.chartArea) return 'transparent';
          const { top, bottom } = ctx.chart.chartArea;
          const gradient = ctx.chart.ctx.createLinearGradient(0, top, 0, bottom);
          gradient.addColorStop(0, symbolColor + '40');
          gradient.addColorStop(1, symbolColor + '05');
          return gradient;
        },
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: symbolColor,
        borderWidth: 2,
        order: 1,
      },
    ];

    if (analytics && analytics.length > 0) {
      const analyticsMap = new Map(analytics.map((a) => [a.trade_date, a]));

      datasets.push(
        {
          label: 'SMA 20',
          data: labels.map((d) => analyticsMap.get(d)?.sma_20 ?? null),
          borderColor: '#94a3b8',
          borderDash: [6, 3],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
          tension: 0.3,
          order: 2,
        },
        {
          label: 'SMA 50',
          data: labels.map((d) => analyticsMap.get(d)?.sma_50 ?? null),
          borderColor: '#64748b',
          borderDash: [2, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
          tension: 0.3,
          order: 3,
        },
      );
    }

    return { labels, datasets };
  }, [data, analytics, symbol, symbolColor]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            color: '#94a3b8',
            usePointStyle: true,
            pointStyleWidth: 10,
            padding: 16,
            font: { size: 11 },
          },
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#e2e8f0',
          bodyColor: '#94a3b8',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: (ctx: any) =>
              `${ctx.dataset.label}: $${ctx.parsed.y?.toFixed(2) ?? '—'}`,
          },
        },
      },
      scales: {
        x: {
          type: 'time' as const,
          time: { unit: 'week' as const, tooltipFormat: 'MMM d, yyyy' },
          grid: { color: '#1e293b' },
          ticks: { color: '#64748b', maxTicksLimit: 10, font: { size: 10 } },
        },
        y: {
          grid: { color: '#1e293b' },
          ticks: {
            color: '#64748b',
            font: { size: 10 },
            callback: (v: any) => `$${v}`,
          },
        },
      },
    }),
    [],
  );

  if (data.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
        <p className="text-sm text-slate-500">No price data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-300">
        Price &amp; Moving Averages
      </h3>
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
