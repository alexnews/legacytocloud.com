'use client';

import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">LegacyToCloud</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/docs" className="text-gray-600 hover:text-gray-900">Docs</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            How LegacyToCloud Works
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Migrate your databases to Snowflake in four simple steps. No consultants needed.
          </p>
          <div className="mt-6 flex justify-center">
            <ShareButtons
              title="How LegacyToCloud Works"
              description="Migrate databases to Snowflake in four simple steps"
              url="https://legacytocloud.com/how-it-works"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-24">
          {/* Step 1: Connect */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div className="ml-4 h-1 flex-1 bg-gradient-to-r from-primary-600 to-primary-200 rounded"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Database</h2>
              <p className="text-gray-600 mb-6">
                Securely connect to your source database. We support MSSQL, MySQL, and PostgreSQL.
                Your credentials are encrypted and never stored permanently.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Read-only connection for safety
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  SSL/TLS encryption in transit
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Test connection before proceeding
                </li>
              </ul>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-sm font-mono">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-gray-300 space-y-2">
                <p><span className="text-gray-500">// Connection configuration</span></p>
                <p><span className="text-purple-400">host:</span> <span className="text-green-400">"your-server.database.com"</span></p>
                <p><span className="text-purple-400">port:</span> <span className="text-yellow-400">1433</span></p>
                <p><span className="text-purple-400">database:</span> <span className="text-green-400">"production_db"</span></p>
                <p><span className="text-purple-400">ssl:</span> <span className="text-yellow-400">true</span></p>
                <p className="mt-4 text-green-400">Connection successful</p>
              </div>
            </div>
          </section>

          {/* Step 2: Analyze */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Schema Analysis Report</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tables Analyzed</span>
                  <span className="font-semibold text-gray-900">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Columns</span>
                  <span className="font-semibold text-gray-900">312</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Indexes</span>
                  <span className="font-semibold text-gray-900">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Foreign Keys</span>
                  <span className="font-semibold text-gray-900">34</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-gray-600">3 potential issues detected</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div className="ml-4 h-1 flex-1 bg-gradient-to-r from-primary-600 to-primary-200 rounded"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Analyze Your Schema</h2>
              <p className="text-gray-600 mb-6">
                Our engine scans your entire database schema and identifies tables, columns,
                indexes, constraints, and relationships. We detect potential migration risks automatically.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete schema inventory
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Automatic risk detection
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Data type compatibility check
                </li>
              </ul>
            </div>
          </section>

          {/* Step 3: Generate */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div className="ml-4 h-1 flex-1 bg-gradient-to-r from-primary-600 to-primary-200 rounded"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Generate DDL Scripts</h2>
              <p className="text-gray-600 mb-6">
                We automatically generate Snowflake-compatible DDL scripts with proper data type mappings.
                Review and customize before execution.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Optimized type mappings
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Clustered keys recommendation
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Download or copy scripts
                </li>
              </ul>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-sm font-mono overflow-x-auto">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-gray-300 space-y-1">
                <p><span className="text-blue-400">CREATE TABLE</span> customers (</p>
                <p className="pl-4">id <span className="text-yellow-400">NUMBER</span> <span className="text-purple-400">PRIMARY KEY</span>,</p>
                <p className="pl-4">name <span className="text-yellow-400">VARCHAR</span>(255),</p>
                <p className="pl-4">email <span className="text-yellow-400">VARCHAR</span>(255),</p>
                <p className="pl-4">created_at <span className="text-yellow-400">TIMESTAMP_NTZ</span>,</p>
                <p className="pl-4">metadata <span className="text-yellow-400">VARIANT</span></p>
                <p>);</p>
                <p className="mt-2"><span className="text-gray-500">-- Converted from MSSQL NVARCHAR, DATETIME, JSON</span></p>
              </div>
            </div>
          </section>

          {/* Step 4: Migrate & Validate */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Migration Progress</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">customers</span>
                    <span className="text-green-600">Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">orders</span>
                    <span className="text-green-600">Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">products</span>
                    <span className="text-primary-600">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">inventory</span>
                    <span className="text-gray-400">Pending</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-300 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">2/4 tables validated successfully</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div className="ml-4 h-1 flex-1 bg-gradient-to-r from-primary-600 to-gray-200 rounded"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Migrate & Validate</h2>
              <p className="text-gray-600 mb-6">
                Execute the migration with real-time progress tracking. Our validation engine
                automatically verifies row counts and data integrity.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Bulk load optimization
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Row count verification
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Data integrity checks
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-24 bg-primary-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Migration?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Get started with a free schema analysis. See exactly what your migration will look like before committing.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100">
              Start Free Analysis
            </Link>
            <Link href="/contact" className="border border-white text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700">
              Talk to an Expert
            </Link>
          </div>
        </div>
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
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
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
