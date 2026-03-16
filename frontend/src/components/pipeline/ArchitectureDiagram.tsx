'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ArchitectureResponse, ArchitectureNode } from '@/types/pipeline';

interface ArchitectureDiagramProps {
  data?: ArchitectureResponse;
}

const NODE_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  api: { bg: '#422006', border: '#f59e0b', text: '#fbbf24', icon: 'globe' },
  ingestion: { bg: '#172554', border: '#3b82f6', text: '#60a5fa', icon: 'download' },
  database: { bg: '#052e16', border: '#10b981', text: '#34d399', icon: 'database' },
  transform: { bg: '#172554', border: '#3b82f6', text: '#60a5fa', icon: 'cog' },
  analytics: { bg: '#052e16', border: '#10b981', text: '#34d399', icon: 'chart' },
  backend: { bg: '#2e1065', border: '#8b5cf6', text: '#a78bfa', icon: 'server' },
  frontend: { bg: '#2e1065', border: '#8b5cf6', text: '#a78bfa', icon: 'monitor' },
};

const DEFAULT_NODES: ArchitectureNode[] = [
  { id: 'alphavantage', name: 'Alpha Vantage', type: 'api', description: 'Financial data API providing real-time and historical stock data', tech: 'REST API' },
  { id: 'ingestion', name: 'Python Ingestion', type: 'ingestion', description: 'Fetches stock data and loads into PostgreSQL staging area', tech: 'Python / Requests' },
  { id: 'postgres', name: 'PostgreSQL', type: 'database', description: 'OLTP database for raw data staging and pipeline metadata', tech: 'PostgreSQL 16' },
  { id: 'transform', name: 'Python Transform', type: 'transform', description: 'Calculates technical indicators, moving averages, and analytics', tech: 'Python / Pandas' },
  { id: 'clickhouse', name: 'ClickHouse', type: 'analytics', description: 'Columnar OLAP database optimized for fast analytical queries', tech: 'ClickHouse 24' },
  { id: 'fastapi', name: 'FastAPI', type: 'backend', description: 'REST API serving analytics data with automatic OpenAPI docs', tech: 'Python / FastAPI' },
  { id: 'nextjs', name: 'Next.js', type: 'frontend', description: 'React dashboard with real-time charts and interactive visualizations', tech: 'Next.js 14 / React' },
];

const DEFAULT_CONNECTIONS = [
  { from: 'alphavantage', to: 'ingestion', label: 'JSON responses' },
  { from: 'ingestion', to: 'postgres', label: 'Raw OHLCV data' },
  { from: 'postgres', to: 'transform', label: 'Staged data' },
  { from: 'transform', to: 'clickhouse', label: 'Analytics tables' },
  { from: 'clickhouse', to: 'fastapi', label: 'SQL queries' },
  { from: 'fastapi', to: 'nextjs', label: 'REST API' },
];

function NodeIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    globe: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    download: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
    ),
    database: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    cog: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    chart: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    server: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
    monitor: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  };
  const colors = NODE_COLORS[type] || NODE_COLORS.api;
  const iconKey = colors.icon;
  return icons[iconKey] || icons.globe;
}

export default function ArchitectureDiagram({ data }: ArchitectureDiagramProps) {
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const nodes = data?.nodes ?? DEFAULT_NODES;
  const connections = data?.connections ?? DEFAULT_CONNECTIONS;

  const nodeWidth = 140;
  const nodeHeight = 80;
  const gap = 30;
  const totalWidth = nodes.length * nodeWidth + (nodes.length - 1) * gap;
  const svgWidth = totalWidth + 40;
  const svgHeight = 200;

  const nodePositions = nodes.map((_, i) => ({
    x: 20 + i * (nodeWidth + gap),
    y: 50,
  }));

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800 p-6">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="mx-auto"
          role="img"
          aria-label="Data pipeline architecture diagram"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
            </marker>
            <style>{`
              @keyframes flowDash {
                to { stroke-dashoffset: -20; }
              }
              .flow-line {
                animation: flowDash 1.5s linear infinite;
              }
            `}</style>
          </defs>

          {connections.map((conn, i) => {
            const fromIdx = nodes.findIndex((n) => n.id === conn.from);
            const toIdx = nodes.findIndex((n) => n.id === conn.to);
            if (fromIdx === -1 || toIdx === -1) return null;

            const x1 = nodePositions[fromIdx].x + nodeWidth;
            const y1 = nodePositions[fromIdx].y + nodeHeight / 2;
            const x2 = nodePositions[toIdx].x;
            const y2 = nodePositions[toIdx].y + nodeHeight / 2;
            const midX = (x1 + x2) / 2;

            return (
              <g key={`conn-${i}`}>
                <path
                  d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <path
                  d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="flow-line"
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={midX}
                  y={y1 - 12}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9"
                >
                  {conn.label}
                </text>
              </g>
            );
          })}

          {nodes.map((node, i) => {
            const pos = nodePositions[i];
            const colors = NODE_COLORS[node.type] || NODE_COLORS.api;

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                role="button"
                tabIndex={0}
                aria-label={`${node.name}: ${node.description}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedNode(expandedNode === node.id ? null : node.id);
                  }
                }}
              >
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="10"
                  ry="10"
                  fill={colors.bg}
                  stroke={colors.border}
                  strokeWidth="1.5"
                  opacity="0.9"
                />
                <text
                  x={pos.x + nodeWidth / 2}
                  y={pos.y + 32}
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize="12"
                  fontWeight="600"
                >
                  {node.name}
                </text>
                <text
                  x={pos.x + nodeWidth / 2}
                  y={pos.y + 50}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9"
                >
                  {node.tech}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <AnimatePresence>
        {expandedNode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800"
          >
            {(() => {
              const node = nodes.find((n) => n.id === expandedNode);
              if (!node) return null;
              const colors = NODE_COLORS[node.type] || NODE_COLORS.api;
              return (
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span style={{ color: colors.text }}>
                      <NodeIcon type={node.type} />
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{node.name}</h4>
                      <p className="text-xs text-slate-400">{node.tech}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">{node.description}</p>
                  {node.metrics && Object.keys(node.metrics).length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {Object.entries(node.metrics).map(([k, v]) => (
                        <div key={k} className="rounded-md bg-slate-900/50 px-3 py-2">
                          <p className="text-xs text-slate-500">{k}</p>
                          <p className="text-sm font-medium text-slate-200">{String(v)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
