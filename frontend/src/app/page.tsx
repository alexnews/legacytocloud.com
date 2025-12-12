export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">LegacyToCloud</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
            <a href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              Get Started
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
              Database Migration
              <span className="block text-primary-600">Made Simple</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Migrate your legacy MSSQL, MySQL and PostgreSQL databases to Snowflake
              with automated analysis, proven playbooks, and zero guesswork.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <a href="/register" className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700">
                Start Free Analysis
              </a>
              <a href="#how-it-works" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50">
                See How It Works
              </a>
            </div>
          </div>
        </div>

        {/* Migration Paths */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Supported Migration Paths
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* MSSQL to Snowflake */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-red-600">SQL</span>
                  </div>
                  <svg className="mx-3 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18l5.45 2.73L12 9.64 6.55 6.91 12 4.18zM6 8.27l5 2.5v7.96l-5-2.5V8.27zm12 7.96l-5 2.5v-7.96l5-2.5v7.96z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">MSSQL &rarr; Snowflake</h3>
                <p className="mt-2 text-gray-600">
                  Migrate SQL Server workloads to the cloud data warehouse.
                </p>
              </div>

              {/* MySQL to Snowflake */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">My</span>
                  </div>
                  <svg className="mx-3 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18l5.45 2.73L12 9.64 6.55 6.91 12 4.18zM6 8.27l5 2.5v7.96l-5-2.5V8.27zm12 7.96l-5 2.5v-7.96l5-2.5v7.96z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">MySQL &rarr; Snowflake</h3>
                <p className="mt-2 text-gray-600">
                  Move your analytics workloads to the cloud data warehouse.
                </p>
              </div>

              {/* PostgreSQL to Snowflake */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">PG</span>
                  </div>
                  <svg className="mx-3 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18l5.45 2.73L12 9.64 6.55 6.91 12 4.18zM6 8.27l5 2.5v7.96l-5-2.5V8.27zm12 7.96l-5 2.5v-7.96l5-2.5v7.96z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">PostgreSQL &rarr; Snowflake</h3>
                <p className="mt-2 text-gray-600">
                  Scale your analytics with a dedicated cloud warehouse.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              How LegacyToCloud Works
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">1. Analyze</h3>
                <p className="mt-2 text-gray-600">
                  Connect your database and get instant schema analysis with risk detection.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">2. Plan</h3>
                <p className="mt-2 text-gray-600">
                  Get a detailed migration plan with type mappings and DDL scripts.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">3. Migrate</h3>
                <p className="mt-2 text-gray-600">
                  Execute bulk load and incremental sync with progress tracking.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">4. Validate</h3>
                <p className="mt-2 text-gray-600">
                  Verify data integrity with automated validation checks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Modernize Your Database?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Start with a free schema analysis. No credit card required.
            </p>
            <a href="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100">
              Get Started Free
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
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
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/docs" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Migrations</h4>
              <ul className="space-y-2">
                <li><a href="/mssql-to-snowflake" className="hover:text-white">MSSQL to Snowflake</a></li>
                <li><a href="/mysql-to-snowflake" className="hover:text-white">MySQL to Snowflake</a></li>
                <li><a href="/postgresql-to-snowflake" className="hover:text-white">PostgreSQL to Snowflake</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="/blog" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; 2025 LegacyToCloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
