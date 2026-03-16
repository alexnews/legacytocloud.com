import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pipeline Architecture',
  description:
    'Interactive visualization of a production finance analytics pipeline architecture. Shows data flow from Alpha Vantage API through Python ingestion, PostgreSQL, pandas transformation, ClickHouse analytics, to a Next.js dashboard.',
  openGraph: {
    title: 'Pipeline Architecture | LegacyToCloud',
    description:
      'Interactive architecture diagram: Alpha Vantage → Python → PostgreSQL → pandas → ClickHouse → FastAPI → Next.js.',
    url: 'https://www.legacytocloud.com/demo/architecture/',
  },
};

export default function ArchitectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
