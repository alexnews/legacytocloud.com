import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.legacytocloud.com'),
  title: {
    default: 'LegacyToCloud - Database Migration Made Simple',
    template: '%s | LegacyToCloud',
  },
  description: 'Migrate legacy MSSQL, MySQL and PostgreSQL databases to Snowflake cloud platform safely and predictably.',
  keywords: 'database migration, MSSQL to Snowflake, MySQL to Snowflake, PostgreSQL to Snowflake, legacy database, cloud migration',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.legacytocloud.com',
    siteName: 'LegacyToCloud',
    title: 'LegacyToCloud - Database Migration Made Simple',
    description: 'Migrate legacy MSSQL, MySQL and PostgreSQL databases to Snowflake cloud platform safely and predictably.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LegacyToCloud - Database Migration Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LegacyToCloud - Database Migration Made Simple',
    description: 'Migrate legacy MSSQL, MySQL and PostgreSQL databases to Snowflake cloud platform safely and predictably.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'IIy4H76gWeK08tjxtvPHBLCih5k6jWZ4ZzUqNNvCzBY',
    other: {
      'msvalidate.01': 'DBF2085FEDD8CDB457C1618B07E65EE1',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FE8Y20HQ04"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FE8Y20HQ04');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
