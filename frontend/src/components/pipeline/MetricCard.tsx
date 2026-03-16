'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  loading?: boolean;
  accentColor?: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = display;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) {
        ref.current = requestAnimationFrame(tick);
      }
    }

    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>;
}

export default function MetricCard({
  label,
  value,
  change,
  icon,
  loading = false,
  accentColor,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-3 w-20 rounded bg-slate-700" />
          <div className="h-7 w-28 rounded bg-slate-700" />
          <div className="h-3 w-16 rounded bg-slate-700" />
        </div>
      </div>
    );
  }

  const isNumericValue = typeof value === 'number';
  const changeIsPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-slate-700 bg-slate-800 p-5 transition-colors hover:border-slate-600"
      style={accentColor ? { borderTopColor: accentColor, borderTopWidth: '2px' } : undefined}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
        {icon && (
          <span className="text-slate-500" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      <p className="mt-2 text-2xl font-bold text-white">
        {isNumericValue ? <AnimatedNumber value={value} /> : value}
      </p>

      {change !== undefined && (
        <p
          className={`mt-1 text-sm font-medium ${
            changeIsPositive ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {changeIsPositive ? '+' : ''}
          {change.toFixed(2)}%
        </p>
      )}
    </motion.div>
  );
}
