import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Database Migration Services',
  description:
    'Enterprise database migration tools for MySQL, PostgreSQL, MariaDB, MSSQL to Snowflake. Schema analysis, automated migration planning, data validation, and real-time progress tracking.',
  openGraph: {
    title: 'Database Migration Services | LegacyToCloud',
    description:
      'Migrate legacy databases to Snowflake with automated schema analysis, migration planning, and data validation.',
    url: 'https://www.legacytocloud.com/services/',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
