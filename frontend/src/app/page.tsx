'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { Article } from '@/types/news';
import { getArticles } from '@/lib/news-api';

/* ------------------------------------------------------------------ */
/*  Sparkline Animation - SVG mini chart for hero section             */
/* ------------------------------------------------------------------ */
function Sparkline({ color, delay }: { color: string; delay: number }) {
  const points = [40, 38, 42, 35, 45, 43, 50, 47, 55, 52, 58, 54, 60, 57, 62, 65, 63, 68, 64, 70];
  const width = 200;
  const height = 60;
  const step = width / (points.length - 1);
  const pathD = points
    .map((y, i) => `${i === 0 ? 'M' : 'L'}${i * step},${height - y}`)
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathD} L${width},${height} L0,${height} Z`}
        fill={`url(#grad-${color})`}
      />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-draw-line"
        style={{ animationDelay: `${delay}ms` }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated counter with IntersectionObserver                        */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Architecture Node                                                 */
/* ------------------------------------------------------------------ */
function PipelineNode({
  label,
  sublabel,
  metric,
  icon,
}: {
  label: string;
  sublabel: string;
  metric: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[100px]">
      <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all">
        {icon}
      </div>
      <span className="text-sm font-semibold text-white">{label}</span>
      <span className="text-xs text-slate-400">{sublabel}</span>
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
        {metric}
      </span>
    </div>
  );
}

function PipelineArrow() {
  return (
    <div className="flex items-center justify-center w-8 shrink-0 mt-[-40px]">
      <div className="w-8 h-px border-t-2 border-dashed border-slate-600 animate-dash" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tech Card                                                         */
/* ------------------------------------------------------------------ */
function TechCard({ name, role, icon }: { name: string; role: string; icon: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-slate-500 hover:bg-slate-800 transition-all group">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
        {name}
      </h3>
      <p className="text-xs text-slate-400 mt-1">{role}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Migration Card                                                    */
/* ------------------------------------------------------------------ */
function MigrationCard({
  source,
  sourceColor,
  description,
}: {
  source: string;
  sourceColor: string;
  description: string;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-500 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${sourceColor}`}>
          {source}
        </span>
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        <span className="px-3 py-1 rounded-lg text-xs font-bold border bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
          Snowflake
        </span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{source} to Snowflake</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

/* ================================================================== */
/*  HOMEPAGE                                                          */
/* ================================================================== */
export default function Home() {
  const [latestNews, setLatestNews] = useState<Article[]>([]);

  useEffect(() => {
    getArticles(1, 3)
      .then((res) => setLatestNews(res.items))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <SiteHeader />

      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Portfolio Project &mdash; Data Engineering
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Real-Time Finance{' '}
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent">
                  Analytics Pipeline
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-400 max-w-xl leading-relaxed">
                Production-grade data engineering: Alpha&nbsp;Vantage&nbsp;API &rarr; Python &rarr;
                PostgreSQL &rarr; ClickHouse &rarr; FastAPI &rarr; Next.js
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/demo/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
                >
                  View Live Dashboard
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="/demo/architecture"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-lg transition-colors"
                >
                  Explore Architecture
                </Link>
              </div>
            </div>

            {/* Right - mini sparklines preview */}
            <div className="hidden lg:block">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-400">Live Preview</span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Streaming
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { symbol: 'AAPL', color: '#3b82f6', change: '+2.14%' },
                    { symbol: 'MSFT', color: '#10b981', change: '+1.87%' },
                    { symbol: 'JPM', color: '#f59e0b', change: '+0.93%' },
                    { symbol: 'GS', color: '#8b5cf6', change: '+1.52%' },
                  ].map((stock, i) => (
                    <div key={stock.symbol} className="bg-slate-900/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white">{stock.symbol}</span>
                        <span className="text-xs text-emerald-400">{stock.change}</span>
                      </div>
                      <div className="h-10">
                        <Sparkline color={stock.color} delay={i * 200} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  ARCHITECTURE STRIP                                          */}
      {/* ============================================================ */}
      <section className="py-20 border-t border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4">
            End-to-End Pipeline Architecture
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-xl mx-auto">
            Data flows through seven stages from external API to interactive dashboard
          </p>

          <div className="overflow-x-auto pb-4">
            <div className="flex items-start justify-center gap-2 min-w-[800px] px-4">
              <PipelineNode
                label="API"
                sublabel="Alpha Vantage"
                metric="4 Symbols"
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <PipelineArrow />
              <PipelineNode
                label="Ingestion"
                sublabel="Python"
                metric="1yr Data"
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                }
              />
              <PipelineArrow />
              <PipelineNode
                label="OLTP"
                sublabel="PostgreSQL"
                metric="Raw Store"
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                }
              />
              <PipelineArrow />
              <PipelineNode
                label="Transform"
                sublabel="Python"
                metric="6 Indicators"
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
              <PipelineArrow />
              <PipelineNode
                label="OLAP"
                sublabel="ClickHouse"
                metric="Fast Query"
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
              <PipelineArrow />
              <PipelineNode
                label="API"
                sublabel="FastAPI"
                metric="REST"
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <PipelineArrow />
              <PipelineNode
                label="UI"
                sublabel="Next.js"
                metric="Interactive"
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TECH STACK GRID                                             */}
      {/* ============================================================ */}
      <section className="py-20 border-t border-slate-800 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4">Tech Stack</h2>
          <p className="text-center text-slate-400 mb-12 max-w-lg mx-auto">
            Production-grade tools chosen for reliability, performance, and real-world adoption
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <TechCard icon="&#x1F40D;" name="Python" role="Data ingestion & ETL" />
            <TechCard icon="&#x26A1;" name="FastAPI" role="Async REST API layer" />
            <TechCard icon="&#x1F418;" name="PostgreSQL" role="OLTP data store" />
            <TechCard icon="&#x1F3CE;&#xFE0F;" name="ClickHouse" role="OLAP analytics engine" />
            <TechCard icon="&#x25B2;" name="Next.js" role="React frontend framework" />
            <TechCard icon="&#x1F4CA;" name="Chart.js" role="Interactive visualizations" />
            <TechCard icon="&#x1F433;" name="Docker" role="Container orchestration" />
            <TechCard icon="&#x1F3A8;" name="Tailwind CSS" role="Utility-first styling" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  LIVE METRICS BAR                                            */}
      {/* ============================================================ */}
      <section className="py-16 border-t border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white">
                <AnimatedCounter end={50000} suffix="+" />
              </div>
              <p className="text-sm text-slate-400 mt-1">Data Points</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white">
                <AnimatedCounter end={4} />
              </div>
              <p className="text-sm text-slate-400 mt-1">Symbols Tracked</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white">
                <AnimatedCounter end={6} />
              </div>
              <p className="text-sm text-slate-400 mt-1">Technical Indicators</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-3xl sm:text-4xl font-bold text-white">Live</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">Real-Time Pipeline</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SERVICES / MIGRATION SECTION                                */}
      {/* ============================================================ */}
      <section className="py-20 border-t border-slate-800 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4">
            Migration Services
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-lg mx-auto">
            Automated schema analysis and DDL generation for legacy database migrations
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <MigrationCard
              source="MSSQL"
              sourceColor="bg-red-500/20 text-red-400 border-red-500/30"
              description="Migrate SQL Server workloads with automated T-SQL conversion and schema mapping."
            />
            <MigrationCard
              source="MySQL"
              sourceColor="bg-orange-500/20 text-orange-400 border-orange-500/30"
              description="Move MySQL analytics with ENUM handling, charset conversion, and type mapping."
            />
            <MigrationCard
              source="PostgreSQL"
              sourceColor="bg-blue-500/20 text-blue-400 border-blue-500/30"
              description="Scale PostgreSQL analytics with JSONB, array types, and custom domain support."
            />
          </div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all migration services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  LATEST NEWS                                                 */}
      {/* ============================================================ */}
      {latestNews.length > 0 && (
        <section className="py-20 border-t border-slate-800 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4">
              Industry News
            </h2>
            <p className="text-center text-slate-400 mb-12 max-w-lg mx-auto">
              Latest in cloud infrastructure, data engineering, and AI
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {latestNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-all group"
                >
                  {article.image_url && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={article.image_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {article.source && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-2 block">
                        {article.source}
                      </span>
                    )}
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{article.summary}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                View all news
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*  ABOUT / CTA                                                 */}
      {/* ============================================================ */}
      <section id="about" className="py-20 border-t border-slate-800 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">About This Project</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            LegacyToCloud is a portfolio project demonstrating end-to-end data engineering skills.
            It showcases a production-grade pipeline that ingests real financial market data from
            Alpha Vantage, processes it through PostgreSQL and ClickHouse, serves it via FastAPI,
            and renders interactive dashboards with Next.js and Chart.js.
          </p>
          <p className="text-slate-400 leading-relaxed mb-8">
            The project also includes database migration tooling for MSSQL, MySQL, and PostgreSQL
            to Snowflake, featuring automated schema analysis and DDL generation.
          </p>

          <div className="flex items-center justify-center gap-6 mb-10">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>

          <Link
            href="/demo/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
          >
            Explore the Dashboard
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
