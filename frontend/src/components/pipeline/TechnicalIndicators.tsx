'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Chart, Line } from 'react-chartjs-2';
import type { MovingAverages, Symbol } from '@/types/pipeline';

ChartJS.register(
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
  TimeScale,
);

interface TechnicalIndicatorsProps {
  data: MovingAverages[];
  symbol: Symbol;
}

function MACDChart({ data }: { data: MovingAverages[] }) {
  const chartData = useMemo(() => ({
    labels: data.map((d) => d.trade_date),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Histogram',
        data: data.map((d) => d.macd_histogram),
        backgroundColor: data.map((d) =>
          d.macd_histogram >= 0 ? '#10b98180' : '#ef444480',
        ),
        borderWidth: 0,
        order: 2,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: 'MACD',
        data: data.map((d) => d.macd),
        borderColor: '#3b82f6',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
        order: 1,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: 'Signal',
        data: data.map((d) => d.macd_signal),
        borderColor: '#f97316',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
        order: 1,
        yAxisID: 'y',
      },
    ],
  }), [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index' as const, intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: { color: '#94a3b8', usePointStyle: true, pointStyleWidth: 10, padding: 12, font: { size: 10 } },
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#e2e8f0',
          bodyColor: '#94a3b8',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 10,
        },
      },
      scales: {
        x: {
          type: 'time' as const,
          time: { unit: 'week' as const, tooltipFormat: 'MMM d, yyyy' },
          grid: { color: '#1e293b' },
          ticks: { color: '#64748b', maxTicksLimit: 8, font: { size: 10 } },
        },
        y: {
          grid: { color: '#1e293b' },
          ticks: { color: '#64748b', font: { size: 10 } },
        },
      },
    }),
    [],
  );

  return (
    <div className="h-48">
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
}

function RSIChart({ data }: { data: MovingAverages[] }) {
  const chartData = useMemo(() => ({
    labels: data.map((d) => d.trade_date),
    datasets: [
      {
        label: 'RSI (14)',
        data: data.map((d) => d.rsi_14),
        borderColor: '#a78bfa',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Overbought (70)',
        data: data.map(() => 70),
        borderColor: '#ef444460',
        borderDash: [4, 4],
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Oversold (30)',
        data: data.map(() => 30),
        borderColor: '#10b98160',
        borderDash: [4, 4],
        borderWidth: 1,
        pointRadius: 0,
        fill: '-1',
        backgroundColor: '#64748b10',
      },
    ],
  }), [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index' as const, intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: { color: '#94a3b8', usePointStyle: true, pointStyleWidth: 10, padding: 12, font: { size: 10 } },
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#e2e8f0',
          bodyColor: '#94a3b8',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(1) ?? '—'}`,
          },
        },
      },
      scales: {
        x: {
          type: 'time' as const,
          time: { unit: 'week' as const, tooltipFormat: 'MMM d, yyyy' },
          grid: { color: '#1e293b' },
          ticks: { color: '#64748b', maxTicksLimit: 8, font: { size: 10 } },
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: '#1e293b' },
          ticks: { color: '#64748b', font: { size: 10 }, stepSize: 10 },
        },
      },
    }),
    [],
  );

  return (
    <div className="h-44">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default function TechnicalIndicators({ data, symbol }: TechnicalIndicatorsProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
        <p className="text-sm text-slate-500">No technical data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <h3 className="mb-3 text-sm font-medium text-slate-300">
          MACD &mdash; {symbol}
        </h3>
        <MACDChart data={data} />
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <h3 className="mb-3 text-sm font-medium text-slate-300">
          RSI (14) &mdash; {symbol}
        </h3>
        <RSIChart data={data} />
      </div>
    </div>
  );
}
