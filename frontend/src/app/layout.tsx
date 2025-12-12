import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
