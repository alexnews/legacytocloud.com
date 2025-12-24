'use client';

import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';

export default function AuroraToSnowflakePage() {
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
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <svg className="mx-4 w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18l5.45 2.73L12 9.64 6.55 6.91 12 4.18zM6 8.27l5 2.5v7.96l-5-2.5V8.27zm12 7.96l-5 2.5v-7.96l5-2.5v7.96z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Amazon Aurora to Snowflake Migration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Migrate from Amazon Aurora (MySQL/PostgreSQL) to Snowflake
            for true cloud-native analytics and multi-cloud flexibility.
          </p>
          <div className="mt-6 flex justify-center">
            <ShareButtons
              title="Amazon Aurora to Snowflake Migration"
              description="Migrate Aurora to Snowflake for cloud-native analytics and multi-cloud flexibility"
              url="https://legacytocloud.com/aurora-to-snowflake"
            />
          </div>
        </div>

        {/* Aurora Flavors */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">We Support Both Aurora Flavors</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-orange-600">My</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Aurora MySQL</h3>
              </div>
              <p className="text-gray-600 mb-4">
                MySQL 5.7 and 8.0 compatible Aurora clusters with full type mapping support.
              </p>
              <ul className="space-y-1 text-sm text-gray-500">
                <li>- MySQL data types</li>
                <li>- Stored procedures analysis</li>
                <li>- JSON column support</li>
              </ul>
            </div>
            <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-blue-600">Pg</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Aurora PostgreSQL</h3>
              </div>
              <p className="text-gray-600 mb-4">
                PostgreSQL 11-15 compatible Aurora with advanced type support.
              </p>
              <ul className="space-y-1 text-sm text-gray-500">
                <li>- PostgreSQL data types</li>
                <li>- JSONB to VARIANT</li>
                <li>- Array types handling</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Migrate */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Migrate from Aurora to Snowflake?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Cloud Freedom</h3>
              <p className="text-gray-600">
                Break free from AWS lock-in. Snowflake runs on AWS, Azure, and GCP with seamless data sharing across clouds.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">True Separation of Concerns</h3>
              <p className="text-gray-600">
                Keep Aurora for OLTP workloads, use Snowflake for analytics. No more read replica performance issues.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlimited Concurrency</h3>
              <p className="text-gray-600">
                Aurora tops out at 128 connections. Snowflake scales compute independently with unlimited concurrent users.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Predictable Costs</h3>
              <p className="text-gray-600">
                No more Aurora I/O cost surprises. Snowflake offers simple, predictable credit-based pricing.
              </p>
            </div>
          </div>
        </section>

        {/* Data Type Mappings */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Type Mappings</h2>
          <p className="text-gray-600 mb-4">Type mappings depend on your Aurora flavor (MySQL or PostgreSQL):</p>

          <div className="space-y-6">
            {/* Aurora MySQL */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Aurora MySQL Types</h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aurora MySQL</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Snowflake</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">INT, BIGINT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">NUMBER</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Direct mapping</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR, TEXT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Up to 16MB</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">DATETIME</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">TIMESTAMP_NTZ</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nanosecond precision</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">JSON</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARIANT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Native JSON support</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Aurora PostgreSQL */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Aurora PostgreSQL Types</h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aurora PostgreSQL</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Snowflake</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">INTEGER, BIGINT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">NUMBER</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Direct mapping</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">TEXT, VARCHAR</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Up to 16MB</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">TIMESTAMPTZ</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">TIMESTAMP_TZ</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Timezone preserved</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">JSONB</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARIANT</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Full JSON support</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">UUID</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR(36)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">String representation</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">ARRAY</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">ARRAY</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Native array support</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Migration Process */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Migration Process</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold text-gray-900">Connect to Aurora</h3>
                <p className="text-gray-600">Securely connect via your Aurora cluster endpoint. We auto-detect MySQL or PostgreSQL compatibility mode.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-gray-900">Schema Analysis</h3>
                <p className="text-gray-600">Scan all databases, tables, indexes, and Aurora-specific features like Global Database replication.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-gray-900">Generate Snowflake DDL</h3>
                <p className="text-gray-600">Create optimized Snowflake schemas with proper clustering keys based on your query patterns.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">4</div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Migration</h3>
                <p className="text-gray-600">Export via Aurora snapshots to S3, then bulk load into Snowflake for maximum efficiency.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">5</div>
              <div>
                <h3 className="font-semibold text-gray-900">Validate & Sync</h3>
                <p className="text-gray-600">Run validation queries, set up CDC for ongoing sync if needed, and go live.</p>
              </div>
            </div>
          </div>
        </section>

        {/* AWS Integration Note */}
        <section className="mb-16">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AWS Integration</h3>
            <p className="text-gray-600">
              Since Aurora runs on AWS, we can leverage native AWS features for efficient data transfer:
              Aurora snapshots export to S3, then Snowflake loads directly from your S3 bucket.
              This minimizes data transfer costs and maximizes throughput.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Migrate Aurora to Snowflake?
          </h2>
          <p className="text-primary-100 mb-8">
            Start with a free schema analysis and get a detailed migration plan.
          </p>
          <Link href="/register" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100">
            Start Free Analysis
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
                <li><Link href="/about" className="hover:text-white">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Migrations</h4>
              <ul className="space-y-2">
                <li><Link href="/mssql-to-snowflake" className="hover:text-white">MSSQL to Snowflake</Link></li>
                <li><Link href="/mysql-to-snowflake" className="hover:text-white">MySQL to Snowflake</Link></li>
                <li><Link href="/postgresql-to-snowflake" className="hover:text-white">PostgreSQL to Snowflake</Link></li>
                <li><Link href="/mariadb-to-snowflake" className="hover:text-white">MariaDB to Snowflake</Link></li>
                <li><Link href="/aurora-to-snowflake" className="hover:text-white">Aurora to Snowflake</Link></li>
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
