import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics | LegacyToCloud',
  description:
    'Data analytics dashboard powered by dbt — article insights, weekly news volume, and stock market summaries.',
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
