'use client';

import { motion } from 'framer-motion';
import type { PipelineHealth, PipelineMetrics, PipelineRun } from '@/types/pipeline';

interface PipelineHealthPanelProps {
  health?: PipelineHealth;
  metrics?: PipelineMetrics;
  runs?: PipelineRun[];
  loading?: boolean;
}

function StatusBadge({ status }: { status: string }) {
  const isHealthy = status === 'healthy' || status === 'ok';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isHealthy
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'bg-red-500/10 text-red-400'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isHealthy ? 'bg-emerald-400' : 'bg-red-400'
        }`}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function RunStatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'success':
      return <span className="text-emerald-400">&#10003;</span>;
    case 'failed':
      return <span className="text-red-400">&#10007;</span>;
    default:
      return <span className="text-amber-400">&#8942;</span>;
  }
}

export default function PipelineHealthPanel({
  health,
  metrics,
  runs,
  loading = false,
}: PipelineHealthPanelProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-slate-700" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-full rounded bg-slate-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-slate-700 bg-slate-800 p-5 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Pipeline Health</h3>
        {health && <StatusBadge status={health.status} />}
      </div>

      {health && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">ClickHouse</span>
            <span className={health.clickhouse_connected ? 'text-emerald-400' : 'text-red-400'}>
              {health.clickhouse_connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">PostgreSQL</span>
            <span className={health.postgres_connected ? 'text-emerald-400' : 'text-red-400'}>
              {health.postgres_connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Last Sync</span>
            <span className="text-slate-200">{formatTimeAgo(health.last_sync)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Rows</span>
            <span className="text-slate-200">{health.total_rows.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Symbols Tracked</span>
            <span className="text-slate-200">{health.symbols_tracked}</span>
          </div>
        </div>
      )}

      {metrics && (
        <div className="border-t border-slate-700 pt-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Metrics
          </h4>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Data Freshness</span>
            <span className="text-slate-200">
              {metrics.data_freshness_hours !== null
                ? `${metrics.data_freshness_hours.toFixed(1)}h`
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Runs (24h)</span>
            <span className="text-slate-200">{metrics.pipeline_runs_24h}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Avg Transform</span>
            <span className="text-slate-200">
              {metrics.avg_transform_seconds !== null
                ? `${metrics.avg_transform_seconds.toFixed(1)}s`
                : 'N/A'}
            </span>
          </div>
        </div>
      )}

      {runs && runs.length > 0 && (
        <div className="border-t border-slate-700 pt-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Recent Runs
          </h4>
          <div className="space-y-2">
            {runs.slice(0, 5).map((run) => (
              <div
                key={run.id}
                className="flex items-center gap-2 rounded-md bg-slate-900/50 px-3 py-2 text-xs"
              >
                <RunStatusIcon status={run.status} />
                <span className="flex-1 truncate text-slate-300">
                  {run.run_type}
                </span>
                <span className="shrink-0 text-slate-500">
                  {run.rows_inserted.toLocaleString()} rows
                </span>
                <span className="shrink-0 text-slate-500">
                  {formatTimeAgo(run.started_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
