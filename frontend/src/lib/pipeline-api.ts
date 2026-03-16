import type {
  PipelineHealth,
  PipelineMetrics,
  PipelineRun,
  StockWithChange,
  StockOHLCV,
  MovingAverages,
  VolumeAnalysis,
  ArchitectureResponse,
} from '@/types/pipeline';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api';

async function fetchPipeline<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}/pipeline${endpoint}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Pipeline API error: ${res.status}`);
  }
  return res.json();
}

export function getHealth(): Promise<PipelineHealth> {
  return fetchPipeline<PipelineHealth>('/health');
}

export function getMetrics(): Promise<PipelineMetrics> {
  return fetchPipeline<PipelineMetrics>('/metrics');
}

export function getStocks(): Promise<StockWithChange[]> {
  return fetchPipeline<StockWithChange[]>('/stocks');
}

export function getStockOHLCV(
  symbol: string,
  days: number = 90,
): Promise<StockOHLCV[]> {
  return fetchPipeline<StockOHLCV[]>(
    `/stocks/${symbol}?days=${days}`,
  );
}

export function getStockAnalytics(
  symbol: string,
  days: number = 90,
): Promise<MovingAverages[]> {
  return fetchPipeline<MovingAverages[]>(
    `/stocks/${symbol}/analytics?days=${days}`,
  );
}

export function getStockVolume(
  symbol: string,
  days: number = 90,
): Promise<VolumeAnalysis[]> {
  return fetchPipeline<VolumeAnalysis[]>(
    `/stocks/${symbol}/volume?days=${days}`,
  );
}

export function getRuns(): Promise<PipelineRun[]> {
  return fetchPipeline<PipelineRun[]>('/runs');
}

export function getArchitecture(): Promise<ArchitectureResponse> {
  return fetchPipeline<ArchitectureResponse>('/architecture');
}
