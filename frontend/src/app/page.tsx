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
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
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
              Migrate your legacy MySQL and PostgreSQL databases to modern cloud platforms
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
              {/* MySQL to PostgreSQL */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🐬</span>
                  </div>
                  <span className="mx-3 text-gray-400">→</span>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🐘</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">MySQL → PostgreSQL</h3>
                <p className="mt-2 text-gray-600">
                  Modernize your LAMP stack with the most powerful open-source database.
                </p>
              </div>

              {/* MySQL to Snowflake */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🐬</span>
                  </div>
                  <span className="mx-3 text-gray-400">→</span>
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">❄️</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">MySQL → Snowflake</h3>
                <p className="mt-2 text-gray-600">
                  Move your analytics workloads to the cloud data warehouse.
                </p>
              </div>

              {/* PostgreSQL to Snowflake */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🐘</span>
                  </div>
                  <span className="mx-3 text-gray-400">→</span>
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">❄️</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">PostgreSQL → Snowflake</h3>
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
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold">1. Analyze</h3>
                <p className="mt-2 text-gray-600">
                  Connect your database and get instant schema analysis with risk detection.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-lg font-semibold">2. Plan</h3>
                <p className="mt-2 text-gray-600">
                  Get a detailed migration plan with type mappings and DDL scripts.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-lg font-semibold">3. Migrate</h3>
                <p className="mt-2 text-gray-600">
                  Execute bulk load and incremental sync with progress tracking.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
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
                <li><a href="/mysql-to-postgresql" className="hover:text-white">MySQL to PostgreSQL</a></li>
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
            <p>&copy; 2024 LegacyToCloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
