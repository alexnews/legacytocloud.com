import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Database Migration Tips & Best Practices | LegacyToCloud',
  description: 'Expert tips for migrating MySQL, PostgreSQL, and SQL Server to Snowflake. Avoid common mistakes, optimize performance, and ensure successful migrations.',
  keywords: 'database migration tips, Snowflake best practices, migration mistakes, MySQL migration guide, database optimization',
  openGraph: {
    title: 'Database Migration Tips & Best Practices',
    description: 'Expert advice for successful database migrations to Snowflake',
    url: 'https://www.legacytocloud.com/tips',
    type: 'website',
  },
};

const tips = [
  {
    id: 'analyze-first',
    title: 'Always Analyze Before You Migrate',
    category: 'Planning',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    content: `Never start a migration without understanding your source database. Run a schema analysis to identify:

- **Data types** that need conversion (ENUM, SET, custom types)
- **Tables without primary keys** (harder to sync incrementally)
- **Large tables** that need special handling
- **Stored procedures and triggers** that need rewriting
- **Foreign key relationships** for migration ordering

A 30-minute analysis can save weeks of troubleshooting.`,
  },
  {
    id: 'use-read-replica',
    title: 'Use a Read Replica for Analysis',
    category: 'Security',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    content: `Don't connect migration tools directly to your production database. Instead:

1. **Create a read replica** in your cloud provider (RDS, Cloud SQL, Azure)
2. **Use a read-only user** with minimal permissions
3. **Schedule analysis during low-traffic periods**
4. **Or export schema only**: \`mysqldump --no-data mydb > schema.sql\`

This protects production performance and reduces security exposure.`,
  },
  {
    id: 'handle-enums',
    title: 'Plan for ENUM and SET Types',
    category: 'Data Types',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    content: `MySQL ENUM and SET types don't exist in Snowflake. Here's how to handle them:

**Option 1: VARCHAR with documentation**
\`\`\`sql
-- Source: status ENUM('pending','active','closed')
-- Target:
status VARCHAR(50) COMMENT 'Values: pending, active, closed'
\`\`\`

**Option 2: Lookup table** (enforces values)
\`\`\`sql
CREATE TABLE status_types (status VARCHAR(50) PRIMARY KEY);
INSERT INTO status_types VALUES ('pending'),('active'),('closed');
\`\`\`

**Option 3: CHECK constraint** (Snowflake supports this)
\`\`\`sql
status VARCHAR(50) CHECK (status IN ('pending','active','closed'))
\`\`\``,
  },
  {
    id: 'batch-large-tables',
    title: 'Batch Large Tables by Primary Key',
    category: 'Performance',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    content: `Loading a 100GB table in one query will fail or timeout. Instead, batch by primary key:

\`\`\`sql
-- Export in chunks
SELECT * FROM orders WHERE id BETWEEN 1 AND 1000000;
SELECT * FROM orders WHERE id BETWEEN 1000001 AND 2000000;
-- ... continue
\`\`\`

**Best practices:**
- Use 1-10GB chunks depending on network speed
- Export to compressed CSV or Parquet
- Stage files in S3/GCS before loading to Snowflake
- Use Snowflake's COPY INTO with parallel file loading
- Track progress so you can resume on failure`,
  },
  {
    id: 'test-in-clone',
    title: 'Test in a Zero-Copy Clone',
    category: 'Testing',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    content: `Snowflake's zero-copy cloning lets you test without extra storage costs:

\`\`\`sql
-- Create instant clone of your migrated database
CREATE DATABASE mydb_test CLONE mydb_production;

-- Run all your tests
-- If something breaks, drop and re-clone
DROP DATABASE mydb_test;
\`\`\`

**Use clones to:**
- Test application queries before cutover
- Validate data integrity
- Train users on Snowflake
- Run destructive tests safely`,
  },
  {
    id: 'validate-row-counts',
    title: 'Validate Row Counts and Checksums',
    category: 'Validation',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    content: `Never assume migration succeeded. Always validate:

**1. Row counts** (quick check)
\`\`\`sql
-- Source (MySQL)
SELECT 'orders' as tbl, COUNT(*) FROM orders
UNION ALL SELECT 'users', COUNT(*) FROM users;

-- Target (Snowflake)
SELECT 'orders' as tbl, COUNT(*) FROM orders
UNION ALL SELECT 'users', COUNT(*) FROM users;
\`\`\`

**2. Aggregation checks** (data integrity)
\`\`\`sql
SELECT SUM(amount), MIN(created_at), MAX(created_at)
FROM orders;
\`\`\`

**3. Sample comparison** (spot check)
\`\`\`sql
SELECT * FROM orders WHERE id IN (1, 1000, 50000, 99999);
\`\`\``,
  },
  {
    id: 'use-clustering-keys',
    title: 'Use Clustering Keys Instead of Indexes',
    category: 'Performance',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    content: `Snowflake doesn't use traditional indexes. For large tables (>1TB), use clustering keys:

\`\`\`sql
-- Cluster by commonly filtered columns
ALTER TABLE orders CLUSTER BY (created_date, customer_id);
\`\`\`

**When to use clustering:**
- Tables over 1TB
- Frequent filters on specific columns (dates, IDs)
- Range queries (BETWEEN, >, <)

**When NOT needed:**
- Small tables (< 1TB) - Snowflake handles automatically
- Tables rarely queried
- Full table scans`,
  },
  {
    id: 'plan-incremental-sync',
    title: 'Set Up Incremental Sync Before Cutover',
    category: 'Planning',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    content: `Don't do a big-bang migration. Set up continuous sync first:

**1. Initial bulk load** - Load all historical data

**2. Incremental sync** - Keep Snowflake updated
\`\`\`sql
-- Requires updated_at column on source tables
SELECT * FROM orders
WHERE updated_at > '2025-01-01 00:00:00';
\`\`\`

**3. Validation period** - Run both systems in parallel

**4. Cutover** - Brief maintenance window to:
- Stop writes to source
- Final sync
- Switch application connection strings
- Usually under 5 minutes`,
  },
];

const categories = [...new Set(tips.map(t => t.category))];

export default function TipsPage() {
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
            Database Migration Tips
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Best practices and expert advice for successful database migrations to Snowflake.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <a
              key={category}
              href={`#${category.toLowerCase()}`}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700"
            >
              {category}
            </a>
          ))}
        </div>

        {/* Tips List */}
        <div className="space-y-8">
          {tips.map((tip) => (
            <article
              key={tip.id}
              id={tip.id}
              className="bg-white border border-gray-200 rounded-xl p-6 scroll-mt-20"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                  {tip.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {tip.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{tip.title}</h2>
                  <div className="prose prose-gray max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-600 leading-relaxed text-sm">
                      {tip.content}
                    </pre>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* More Resources */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <Link
            href="/glossary"
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-200 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Glossary</h3>
            <p className="text-gray-600 text-sm">Learn database migration terminology</p>
          </Link>
          <Link
            href="/faq"
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-200 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-gray-600 text-sm">Common questions about migrations</p>
          </Link>
        </div>

        {/* CTA */}
        <section className="mt-16 text-center bg-primary-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Put These Tips Into Practice
          </h2>
          <p className="text-primary-100 mb-8">
            Start with a free schema analysis and get personalized migration recommendations.
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
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/glossary" className="hover:text-white">Glossary</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/tips" className="hover:text-white">Migration Tips</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Migrations</h4>
              <ul className="space-y-2">
                <li><Link href="/mysql-to-snowflake" className="hover:text-white">MySQL to Snowflake</Link></li>
                <li><Link href="/postgresql-to-snowflake" className="hover:text-white">PostgreSQL to Snowflake</Link></li>
                <li><Link href="/mssql-to-snowflake" className="hover:text-white">MSSQL to Snowflake</Link></li>
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
