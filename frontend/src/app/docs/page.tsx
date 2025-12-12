'use client';

import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';

export default function DocsPage() {
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
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about migrating your databases to Snowflake.
          </p>
          <div className="mt-6 flex justify-center">
            <ShareButtons
              title="LegacyToCloud Documentation"
              description="Complete guide to database migrations to Snowflake"
              url="https://legacytocloud.com/docs"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Link href="#getting-started" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
            <p className="text-gray-600 text-sm">Learn the basics and run your first analysis in minutes.</p>
          </Link>
          <Link href="#connections" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Database Connections</h3>
            <p className="text-gray-600 text-sm">Configure secure connections to your source and target databases.</p>
          </Link>
          <Link href="#migration" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Running Migrations</h3>
            <p className="text-gray-600 text-sm">Execute migrations with confidence using our step-by-step guide.</p>
          </Link>
        </div>

        {/* Getting Started */}
        <section id="getting-started" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Create an Account</h3>
            <p className="text-gray-600 mb-6">
              Sign up for a free account to get started. No credit card required for the free tier.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Create a Project</h3>
            <p className="text-gray-600 mb-6">
              A project represents a single migration effort. Choose your migration type:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>MSSQL to Snowflake</li>
              <li>MySQL to Snowflake</li>
              <li>PostgreSQL to Snowflake</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Add Database Connections</h3>
            <p className="text-gray-600 mb-6">
              Configure your source database connection with host, port, username, and password.
              We use encrypted connections and never store your data.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Run Schema Analysis</h3>
            <p className="text-gray-600">
              Click "Run Analysis" to scan your source database. You'll get a complete inventory of
              tables, columns, indexes, and potential migration risks.
            </p>
          </div>
        </section>

        {/* Connections */}
        <section id="connections" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Database Connections</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Databases</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Source Databases</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>Microsoft SQL Server (2012+)</li>
                  <li>MySQL (5.7+)</li>
                  <li>PostgreSQL (10+)</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Target Database</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>Snowflake (all editions)</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Settings</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">Host</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Database server hostname or IP</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">db.example.com</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">Port</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Database server port</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">3306, 5432, 1433</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">Database</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Database/schema name</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">myapp_production</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">Username</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Database user with read access</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">readonly_user</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">Password</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Database password (encrypted)</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">********</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Security Note</h4>
              <p className="text-blue-800 text-sm">
                We recommend creating a read-only database user for analysis. Passwords are encrypted
                at rest and in transit. We never store your actual data—only schema metadata.
              </p>
            </div>
          </div>
        </section>

        {/* Migration */}
        <section id="migration" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Running Migrations</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Migration Workflow</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">1</div>
                <div>
                  <h4 className="font-medium text-gray-900">Analyze Source Schema</h4>
                  <p className="text-gray-600 text-sm">Run a full schema analysis to discover tables, relationships, and potential issues.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">2</div>
                <div>
                  <h4 className="font-medium text-gray-900">Review Risk Report</h4>
                  <p className="text-gray-600 text-sm">Check for data type incompatibilities, missing primary keys, and other migration risks.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">3</div>
                <div>
                  <h4 className="font-medium text-gray-900">Generate DDL Scripts</h4>
                  <p className="text-gray-600 text-sm">Export Snowflake-compatible CREATE TABLE statements with optimized data types.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">4</div>
                <div>
                  <h4 className="font-medium text-gray-900">Create Target Tables</h4>
                  <p className="text-gray-600 text-sm">Run the DDL scripts in your Snowflake account to create the target schema.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">5</div>
                <div>
                  <h4 className="font-medium text-gray-900">Execute Data Transfer</h4>
                  <p className="text-gray-600 text-sm">Start the migration process with progress tracking and error handling.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">6</div>
                <div>
                  <h4 className="font-medium text-gray-900">Validate Results</h4>
                  <p className="text-gray-600 text-sm">Compare row counts and checksums to ensure data integrity.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Types */}
        <section id="data-types" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Type Reference</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <p className="text-gray-600 mb-6">
              See our detailed migration guides for complete data type mapping tables:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/mssql-to-snowflake" className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <h4 className="font-medium text-gray-900">MSSQL to Snowflake</h4>
                <p className="text-sm text-gray-500">INT, VARCHAR, DATETIME mappings</p>
              </Link>
              <Link href="/mysql-to-snowflake" className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <h4 className="font-medium text-gray-900">MySQL to Snowflake</h4>
                <p className="text-sm text-gray-500">ENUM, JSON, TEXT mappings</p>
              </Link>
              <Link href="/postgresql-to-snowflake" className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <h4 className="font-medium text-gray-900">PostgreSQL to Snowflake</h4>
                <p className="text-sm text-gray-500">JSONB, UUID, ARRAY mappings</p>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-100 mb-8">
            Create a free account and run your first schema analysis.
          </p>
          <Link href="/register" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100">
            Start Free
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
