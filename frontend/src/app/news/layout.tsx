import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industry News',
  description:
    'Latest news and insights on cloud computing, data engineering, AI, and legacy modernization. Curated articles from top industry sources.',
  openGraph: {
    title: 'Industry News | LegacyToCloud',
    description:
      'Latest news and insights on cloud computing, data engineering, AI, and legacy modernization.',
    url: 'https://www.legacytocloud.com/news/',
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
