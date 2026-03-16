'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { Article } from '@/types/news';
import { getArticles } from '@/lib/news-api';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const SOURCE_COLORS: Record<string, string> = {
  'TechCrunch': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'The Verge': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Ars Technica': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Hacker News': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'VentureBeat': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Wired': 'bg-red-500/20 text-red-400 border-red-500/30',
  'InfoQ': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

const DEFAULT_SOURCE_COLOR = 'bg-slate-600/30 text-slate-300 border-slate-500/30';

function getSourceColor(source: string): string {
  return SOURCE_COLORS[source] || DEFAULT_SOURCE_COLOR;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function ArticleCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-700 bg-slate-800 overflow-hidden">
      <div className="h-48 bg-slate-700" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-slate-700 rounded w-20" />
        <div className="h-5 bg-slate-700 rounded w-full" />
        <div className="h-5 bg-slate-700 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-700 rounded w-full" />
          <div className="h-3 bg-slate-700 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group rounded-xl border border-slate-700 bg-slate-800 overflow-hidden hover:border-slate-500 hover:bg-slate-800/80 transition-all"
    >
      {article.image_url ? (
        <div className="h-48 overflow-hidden bg-slate-700">
          <img
            src={article.image_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getSourceColor(article.source)}`}>
            {article.source}
          </span>
          {article.published_at && (
            <span className="text-xs text-slate-500">
              {formatDate(article.published_at)}
            </span>
          )}
        </div>

        <h2 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug mb-2 line-clamp-2">
          {article.title}
        </h2>

        {article.summary && (
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
            {article.summary}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticles(p, 12);
      setArticles(data.items);
      setTotalPages(data.total_pages);
      setTotal(data.total);
      setPage(data.page);
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Unable to load news articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const goToPage = (p: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchData(p);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Industry News
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Latest News
          </h1>
          <p className="mt-3 text-slate-400 max-w-2xl">
            Curated articles on cloud computing, data engineering, AI, and legacy modernization from top industry sources.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center mb-8">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => fetchData(page)}
              className="mt-3 text-xs font-medium text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg px-4 py-2 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : articles.length === 0 && !error ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-slate-400">No articles available yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-10 pt-8 border-t border-slate-800">
                <p className="text-sm text-slate-500">
                  Page {page} of {totalPages} ({total} articles)
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-700 disabled:hover:text-slate-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-700 disabled:hover:text-slate-300"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
