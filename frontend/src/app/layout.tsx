import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LegacyToCloud - Database Migration Made Simple',
  description: 'Migrate legacy MSSQL, MySQL and PostgreSQL databases to Snowflake cloud platform safely and predictably.',
  keywords: 'database migration, MSSQL to Snowflake, MySQL to Snowflake, PostgreSQL to Snowflake, legacy database, cloud migration',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
