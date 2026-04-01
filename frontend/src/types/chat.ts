export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
}

export interface ChatSource {
  title: string;
  slug: string;
  source: string | null;
  similarity: number;
}

export interface ChatStatus {
  total_articles: number;
  embedded_articles: number;
  model_name: string;
  ollama_available: boolean;
}
