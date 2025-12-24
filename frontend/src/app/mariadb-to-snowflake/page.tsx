'use client';

import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';

export default function MariaDBToSnowflakePage() {
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
            <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-amber-700">Ma</span>
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
            MariaDB to Snowflake Migration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Migrate your MariaDB databases to Snowflake cloud data warehouse
            for enterprise-grade analytics and unlimited scalability.
          </p>
          <div className="mt-6 flex justify-center">
            <ShareButtons
              title="MariaDB to Snowflake Migration"
              description="Migrate MariaDB to Snowflake for enterprise analytics and scalability"
              url="https://legacytocloud.com/mariadb-to-snowflake"
            />
          </div>
        </div>

        {/* Why Migrate */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Migrate from MariaDB to Snowflake?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Petabyte-Scale Analytics</h3>
              <p className="text-gray-600">
                Run complex analytical queries across massive datasets without impacting your production MariaDB workloads.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero Infrastructure Management</h3>
              <p className="text-gray-600">
                No more MariaDB tuning, replication lag, or storage upgrades. Snowflake handles all infrastructure.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay Per Query</h3>
              <p className="text-gray-600">
                Only pay for compute when running queries. No costs for idle databases sitting unused.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-gray-600">
                SOC 2, HIPAA, and PCI DSS compliance built-in with end-to-end encryption.
              </p>
            </div>
          </div>
        </section>

        {/* MariaDB Specific Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">MariaDB-Specific Considerations</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <p className="text-gray-700 mb-4">
              MariaDB includes features not found in MySQL. Our migration tool handles these automatically:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Sequences</strong> - Converted to Snowflake sequences with matching start/increment values</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>System-Versioned Tables</strong> - Mapped to Snowflake Time Travel and Streams</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Virtual Columns</strong> - Recreated as Snowflake computed columns where supported</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>JSON Columns</strong> - Native support via Snowflake VARIANT type</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Data Type Mappings */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Type Mappings</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MariaDB Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Snowflake Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">INT, BIGINT, TINYINT</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">NUMBER</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Direct mapping</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR, TEXT, LONGTEXT</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Up to 16MB</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">DATETIME, TIMESTAMP</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">TIMESTAMP_NTZ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nanosecond precision</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">DECIMAL, NUMERIC</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">NUMBER(p,s)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Precision preserved</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">BOOLEAN</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">BOOLEAN</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Direct mapping</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">JSON, LONGBLOB</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARIANT</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Native semi-structured</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">ENUM, SET</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Converted to string</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">UUID</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR(36)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">MariaDB 10.7+ UUID type</td>
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
                <h3 className="font-semibold text-gray-900">Connect & Analyze</h3>
                <p className="text-gray-600">Securely connect to your MariaDB instance and scan all databases, tables, sequences, and relationships.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-gray-900">Review Compatibility</h3>
                <p className="text-gray-600">Get a detailed report on MariaDB-specific features, stored procedures, and migration considerations.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-gray-900">Generate Schema</h3>
                <p className="text-gray-600">Automatically generate Snowflake DDL with optimized data types, clustering keys, and sequences.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">4</div>
              <div>
                <h3 className="font-semibold text-gray-900">Load Data</h3>
                <p className="text-gray-600">Stream data efficiently using staged files with parallel loading for maximum throughput.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">5</div>
              <div>
                <h3 className="font-semibold text-gray-900">Verify & Go Live</h3>
                <p className="text-gray-600">Run automated row count and checksum validation, then switch over with confidence.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Migrate MariaDB to Snowflake?
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
