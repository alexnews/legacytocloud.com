export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  original_url: string;
  source: string;
  image_url: string;
  quality_score: number | null;
  published_at: string | null;
}

export interface NewsListResponse {
  items: Article[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface NewsSource {
  source: string;
  count: number;
}
