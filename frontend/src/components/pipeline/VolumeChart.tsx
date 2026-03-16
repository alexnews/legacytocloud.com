'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Chart } from 'react-chartjs-2';
import type { VolumeAnalysis, StockOHLCV, Symbol } from '@/types/pipeline';

ChartJS.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
);

interface VolumeChartProps {
  data: VolumeAnalysis[];
  ohlcv: StockOHLCV[];
  symbol: Symbol;
}

export default function VolumeChart({ data, ohlcv, symbol }: VolumeChartProps) {
  const chartData = useMemo(() => {
    const ohlcvMap = new Map(ohlcv.map((d) => [d.trade_date, d]));

    const barColors = data.map((d, i) => {
      const current = ohlcvMap.get(d.trade_date);
      if (!current) return '#64748b80';
      const prevDate = i > 0 ? data[i - 1].trade_date : null;
      const prev = prevDate ? ohlcvMap.get(prevDate) : null;
      const prevClose = prev ? prev.close : current.open;
      return current.close >= prevClose ? '#10b98180' : '#ef444480';
    });

    return {
      labels: data.map((d) => d.trade_date),
      datasets: [
        {
          type: 'bar' as const,
          label: 'Volume',
          data: data.map((d) => d.volume),
          backgroundColor: barColors,
          borderWidth: 0,
          order: 2,
          yAxisID: 'y',
        },
        {
          type: 'line' as const,
          label: '20-Day Avg Volume',
          data: data.map((d) => d.avg_volume_20),
          borderColor: '#f97316',
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.3,
          fill: false,
          order: 1,
          yAxisID: 'y',
        },
      ],
    };
  }, [data, ohlcv]);

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
          callbacks: {
            label: (ctx: any) => {
              const val = ctx.parsed.y;
              if (val >= 1_000_000) return `${ctx.dataset.label}: ${(val / 1_000_000).toFixed(1)}M`;
              if (val >= 1_000) return `${ctx.dataset.label}: ${(val / 1_000).toFixed(0)}K`;
              return `${ctx.dataset.label}: ${val}`;
            },
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
            callback: (v: any) => {
              if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`;
              if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
              return v;
            },
          },
        },
      },
    }),
    [],
  );

  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
        <p className="text-sm text-slate-500">No volume data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-300">
        Volume Analysis &mdash; {symbol}
      </h3>
      <div className="h-56">
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  );
}
