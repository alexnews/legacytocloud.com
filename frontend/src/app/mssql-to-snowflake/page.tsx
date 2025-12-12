'use client';

import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';

export default function MSSQLToSnowflakePage() {
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
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-red-600">SQL</span>
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
            MSSQL to Snowflake Migration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Migrate your Microsoft SQL Server databases to Snowflake cloud data warehouse
            with automated schema conversion and data validation.
          </p>
          <div className="mt-6 flex justify-center">
            <ShareButtons
              title="MSSQL to Snowflake Migration"
              description="Migrate SQL Server to Snowflake with automated schema conversion"
              url="https://legacytocloud.com/mssql-to-snowflake"
            />
          </div>
        </div>

        {/* Why Migrate */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Migrate from MSSQL to Snowflake?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlimited Scalability</h3>
              <p className="text-gray-600">
                Scale compute and storage independently. No more capacity planning or hardware upgrades.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay Per Use</h3>
              <p className="text-gray-600">
                Only pay for the compute time you actually use. Pause warehouses when not needed.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Concurrent Users</h3>
              <p className="text-gray-600">
                Support unlimited concurrent queries without performance degradation.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero Maintenance</h3>
              <p className="text-gray-600">
                No patching, no backups to manage, no index tuning. Focus on your data, not infrastructure.
              </p>
            </div>
          </div>
        </section>

        {/* Data Type Mappings */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Type Mappings</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MSSQL Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Snowflake Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">INT, BIGINT, SMALLINT</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">NUMBER</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Direct mapping</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR, NVARCHAR</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">UTF-8 encoding</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">DATETIME, DATETIME2</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">TIMESTAMP_NTZ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nanosecond precision</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">DECIMAL, NUMERIC</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">NUMBER(p,s)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Precision preserved</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">BIT</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">BOOLEAN</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Direct mapping</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">UNIQUEIDENTIFIER</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR(36)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Stored as string</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Migration Process */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Migration Process</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold text-gray-900">Schema Analysis</h3>
                <p className="text-gray-600">Connect to your MSSQL database and analyze tables, columns, indexes, and constraints.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-gray-900">Risk Assessment</h3>
                <p className="text-gray-600">Identify data type incompatibilities, unsupported features, and potential data loss risks.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-gray-900">DDL Generation</h3>
                <p className="text-gray-600">Generate Snowflake-compatible CREATE TABLE statements with proper data types.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">4</div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Transfer</h3>
                <p className="text-gray-600">Bulk load data using optimized methods with progress tracking and error handling.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">5</div>
              <div>
                <h3 className="font-semibold text-gray-900">Validation</h3>
                <p className="text-gray-600">Compare row counts, checksums, and sample data to ensure data integrity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Migrate MSSQL to Snowflake?
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
