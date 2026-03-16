import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finance Analytics Dashboard',
  description:
    'Live stock analytics dashboard with real-time OHLCV data, moving averages (SMA, EMA), MACD, RSI, and volume analysis for AAPL, MSFT, JPM, GS. Powered by Alpha Vantage, PostgreSQL, ClickHouse, and FastAPI.',
  openGraph: {
    title: 'Finance Analytics Dashboard | LegacyToCloud',
    description:
      'Live stock analytics dashboard with technical indicators. Real data pipeline: Alpha Vantage → PostgreSQL → ClickHouse → Next.js.',
    url: 'https://www.legacytocloud.com/demo/dashboard/',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
