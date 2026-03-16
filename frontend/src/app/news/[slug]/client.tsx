'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Article } from '@/types/news';
import { getArticle } from '@/lib/news-api';
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function ArticleSkeleton() {
  return (
    <div className="animate-pulse max-w-3xl mx-auto">
      <div className="h-4 bg-slate-700 rounded w-24 mb-8" />
      <div className="h-64 bg-slate-700 rounded-xl mb-8" />
      <div className="flex gap-3 mb-4">
        <div className="h-5 bg-slate-700 rounded-full w-24" />
        <div className="h-5 bg-slate-700 rounded w-32" />
      </div>
      <div className="h-8 bg-slate-700 rounded w-full mb-2" />
      <div className="h-8 bg-slate-700 rounded w-3/4 mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-700 rounded" style={{ width: `${85 + Math.random() * 15}%` }} />
        ))}
      </div>
    </div>
  );
}

export default function ArticlePage() {
  // Extract slug from actual URL path, not from Next.js params
  // (Apache rewrites /news/any-slug to /news/_/index.html)
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const slug = pathname.replace(/^\/news\//, '').replace(/\/$/, '') || null;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    getArticle(slug)
      .then(setArticle)
      .catch((err) => {
        console.error('Failed to fetch article:', err);
        setError('Unable to load this article. It may not exist or the server is unavailable.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <ArticleSkeleton />
        ) : error ? (
          <div className="max-w-3xl mx-auto text-center py-20">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-slate-400 mb-4">{error}</p>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to News
            </Link>
          </div>
        ) : article ? (
          <article className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to News
            </Link>

            {/* Hero image */}
            {article.image_url && (
              <div className="rounded-xl overflow-hidden mb-8 border border-slate-700">
                <img
                  src={article.image_url}
                  alt=""
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getSourceColor(article.source)}`}>
                {article.source}
              </span>
              {article.published_at && (
                <span className="text-sm text-slate-500">
                  {formatDate(article.published_at)}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-6">
              {article.title}
            </h1>

            {/* Summary */}
            {article.summary && (
              <p className="text-lg text-slate-400 leading-relaxed mb-8 pb-8 border-b border-slate-800">
                {article.summary}
              </p>
            )}

            {/* Content */}
            <div
              className="max-w-none text-slate-300 leading-relaxed
                [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-white [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3
                [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2
                [&_p]:mb-4 [&_p]:leading-relaxed
                [&_a]:text-blue-400 hover:[&_a]:underline
                [&_strong]:text-white [&_strong]:font-semibold
                [&_code]:text-blue-300 [&_code]:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                [&_pre]:bg-slate-800 [&_pre]:border [&_pre]:border-slate-700 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-4
                [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:text-slate-400 [&_blockquote]:italic [&_blockquote]:my-4
                [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-700 [&_img]:my-4
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
                [&_li]:text-slate-300"
              dangerouslySetInnerHTML={{ __html: article.content_html || article.content }}
            />

            {/* Original source link */}
            {article.original_url && (
              <div className="mt-10 pt-8 border-t border-slate-800">
                <a
                  href={article.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
                >
                  Read more at {article.source || 'source'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Back to News - bottom */}
            <div className="mt-10 pt-8 border-t border-slate-800">
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all articles
              </Link>
            </div>
          </article>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
