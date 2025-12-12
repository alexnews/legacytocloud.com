'use client';

import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';

export default function PostgreSQLToSnowflakePage() {
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
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">PG</span>
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
            PostgreSQL to Snowflake Migration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scale your PostgreSQL analytics workloads with Snowflake's cloud-native
            architecture and near-unlimited concurrency.
          </p>
          <div className="mt-6 flex justify-center">
            <ShareButtons
              title="PostgreSQL to Snowflake Migration"
              description="Scale PostgreSQL analytics with Snowflake cloud-native architecture"
              url="https://legacytocloud.com/postgresql-to-snowflake"
            />
          </div>
        </div>

        {/* Why Migrate */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Migrate from PostgreSQL to Snowflake?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No More VACUUM</h3>
              <p className="text-gray-600">
                Forget about VACUUM, ANALYZE, and bloat management. Snowflake handles it all automatically.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Elasticity</h3>
              <p className="text-gray-600">
                Scale from 1 to 1000+ nodes in seconds. No replication lag, no connection limits.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Semi-Structured Data</h3>
              <p className="text-gray-600">
                Native support for JSON, Avro, Parquet. Query nested data without ETL.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Cloud</h3>
              <p className="text-gray-600">
                Run on AWS, Azure, or GCP. Replicate data across clouds for disaster recovery.
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PostgreSQL Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Snowflake Type</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR, TEXT</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Up to 16MB</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">TIMESTAMP, TIMESTAMPTZ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">TIMESTAMP_TZ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Timezone preserved</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">NUMERIC, DECIMAL</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">NUMBER(p,s)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Full precision</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">BOOLEAN</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">BOOLEAN</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Direct mapping</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">JSONB, JSON</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARIANT</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Full JSON support</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">UUID</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">VARCHAR(36)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Stored as string</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">ARRAY</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">ARRAY</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Native array type</td>
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
                <h3 className="font-semibold text-gray-900">Schema Discovery</h3>
                <p className="text-gray-600">Analyze schemas, tables, views, and custom types in your PostgreSQL database.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-gray-900">Compatibility Check</h3>
                <p className="text-gray-600">Identify PL/pgSQL functions, triggers, and extensions that need attention.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-gray-900">Schema Conversion</h3>
                <p className="text-gray-600">Generate optimized Snowflake schemas with appropriate clustering and partitioning.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">4</div>
              <div>
                <h3 className="font-semibold text-gray-900">Parallel Data Load</h3>
                <p className="text-gray-600">Use COPY command with staged files for maximum throughput. Track progress in real-time.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">5</div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Validation</h3>
                <p className="text-gray-600">Compare row counts, run checksum queries, and validate sample records.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Special Considerations */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">PostgreSQL-Specific Considerations</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <span><strong>Custom Types:</strong> PostgreSQL custom types and domains are converted to their base types with documentation.</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <span><strong>Stored Procedures:</strong> PL/pgSQL functions need manual conversion to Snowflake Scripting or JavaScript UDFs.</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <span><strong>Extensions:</strong> PostGIS, pg_trgm, and other extensions require alternative approaches in Snowflake.</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <span><strong>Sequences:</strong> PostgreSQL sequences are mapped to Snowflake sequences with AUTOINCREMENT columns.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Migrate PostgreSQL to Snowflake?
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
