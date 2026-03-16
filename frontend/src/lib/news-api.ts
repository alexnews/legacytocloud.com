import type { Article, NewsListResponse, NewsSource } from '@/types/news';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api';

async function fetchNews<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}/news${endpoint}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`News API error: ${res.status}`);
  }
  return res.json();
}

export function getArticles(
  page: number = 1,
  perPage: number = 12,
): Promise<NewsListResponse> {
  return fetchNews<NewsListResponse>(`?page=${page}&per_page=${perPage}`);
}

export function getArticle(slug: string): Promise<Article> {
  return fetchNews<Article>(`/${slug}`);
}

export function getSources(): Promise<NewsSource[]> {
  return fetchNews<NewsSource[]>('/sources');
}
