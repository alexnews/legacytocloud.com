'use client';

import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">LegacyToCloud</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/#features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            About LegacyToCloud
          </h1>
          <p className="text-xl text-gray-600">
            Making database migrations safe, predictable, and affordable.
          </p>
          <div className="mt-6 flex justify-center">
            <ShareButtons
              title="About LegacyToCloud"
              description="Making database migrations safe, predictable, and affordable"
              url="https://legacytocloud.com/about"
            />
          </div>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            We believe that migrating databases to the cloud should not be a painful,
            expensive, or risky endeavor. LegacyToCloud was built to help organizations
            modernize their data infrastructure with confidence. Our platform automates
            the complex analysis, planning, and execution phases of database migration,
            reducing risk and accelerating time-to-value.
          </p>
        </section>

        {/* Problem */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Problem We Solve</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <span><strong>Schema Incompatibilities:</strong> Different databases have different data types, constraints, and features that don't always translate cleanly.</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <span><strong>Data Loss Risk:</strong> Without proper analysis, migrations can result in truncated data, lost precision, or corrupted records.</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <span><strong>Downtime:</strong> Traditional migrations require extended maintenance windows that impact business operations.</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <span><strong>Hidden Costs:</strong> Manual migrations often take longer than expected, leading to budget overruns.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Solution */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Automated Analysis</h3>
              <p className="text-gray-600">
                Our platform scans your source database and identifies potential migration issues before they become problems.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Detection</h3>
              <p className="text-gray-600">
                Get detailed reports on data type incompatibilities, missing primary keys, and other migration risks.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Execution</h3>
              <p className="text-gray-600">
                Optimized data transfer with bulk loading and incremental sync to minimize downtime.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Validation</h3>
              <p className="text-gray-600">
                Automated checks ensure data integrity after migration with detailed comparison reports.
              </p>
            </div>
          </div>
        </section>

        {/* Supported Migrations */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Supported Migration Paths</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">SQL</span>
                </div>
                <span className="text-gray-400">&rarr;</span>
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18l5.45 2.73L12 9.64 6.55 6.91 12 4.18zM6 8.27l5 2.5v7.96l-5-2.5V8.27zm12 7.96l-5 2.5v-7.96l5-2.5v7.96z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">MSSQL to Snowflake</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-600">My</span>
                </div>
                <span className="text-gray-400">&rarr;</span>
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18l5.45 2.73L12 9.64 6.55 6.91 12 4.18zM6 8.27l5 2.5v7.96l-5-2.5V8.27zm12 7.96l-5 2.5v-7.96l5-2.5v7.96z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">MySQL to Snowflake</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">PG</span>
                </div>
                <span className="text-gray-400">&rarr;</span>
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18l5.45 2.73L12 9.64 6.55 6.91 12 4.18zM6 8.27l5 2.5v7.96l-5-2.5V8.27zm12 7.96l-5 2.5v-7.96l5-2.5v7.96z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">PostgreSQL to Snowflake</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Migrate?
          </h2>
          <p className="text-primary-100 mb-8">
            Start with a free schema analysis and see how LegacyToCloud can help.
          </p>
          <Link href="/register" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100">
            Get Started Free
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <span className="text-xl font-bold text-white">LegacyToCloud</span>
              <p className="mt-4">
                Making database migrations safe, predictable, and affordable.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/#features" className="hover:text-white">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Migrations</h4>
              <ul className="space-y-2">
                <li><Link href="/mssql-to-snowflake" className="hover:text-white">MSSQL to Snowflake</Link></li>
                <li><Link href="/mysql-to-snowflake" className="hover:text-white">MySQL to Snowflake</Link></li>
                <li><Link href="/postgresql-to-snowflake" className="hover:text-white">PostgreSQL to Snowflake</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; 2025 LegacyToCloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
