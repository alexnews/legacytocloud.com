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
    default: 'LegacyToCloud - Real-Time Finance Analytics Pipeline',
    template: '%s | LegacyToCloud',
  },
  description: 'Data engineering portfolio: real-time finance analytics pipeline with Alpha Vantage, Python, PostgreSQL, ClickHouse, FastAPI, and Next.js. Includes database migration tooling for Snowflake.',
  keywords: 'data engineering, finance analytics, stock analytics, pipeline, ClickHouse, FastAPI, PostgreSQL, Next.js, database migration, MSSQL to Snowflake, MySQL to Snowflake, PostgreSQL to Snowflake, real-time analytics',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.legacytocloud.com',
    siteName: 'LegacyToCloud',
    title: 'LegacyToCloud - Real-Time Finance Analytics Pipeline',
    description: 'Production-grade data engineering portfolio showcasing a real-time finance analytics pipeline with Python, PostgreSQL, ClickHouse, FastAPI, and Next.js.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LegacyToCloud - Finance Analytics Pipeline',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LegacyToCloud - Real-Time Finance Analytics Pipeline',
    description: 'Production-grade data engineering portfolio showcasing a real-time finance analytics pipeline with Python, PostgreSQL, ClickHouse, FastAPI, and Next.js.',
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
          src="https://www.googletagmanager.com/gtag/js?id=G-9TD57H49VG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9TD57H49VG');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
