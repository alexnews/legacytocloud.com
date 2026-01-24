import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Database Migration Glossary - LegacyToCloud',
  description: 'Learn key database migration terms: Snowflake, DDL, schema analysis, data type mapping, OLTP vs OLAP, and more. Essential terminology for cloud database migrations.',
  keywords: 'database glossary, Snowflake terms, migration terminology, DDL, schema analysis, data warehouse glossary',
  openGraph: {
    title: 'Database Migration Glossary - LegacyToCloud',
    description: 'Essential terminology for database migrations to Snowflake',
    url: 'https://www.legacytocloud.com/glossary',
    type: 'website',
  },
};

const glossaryTerms = [
  {
    term: 'Snowflake',
    definition: 'A cloud-native data warehouse platform that separates storage and compute, allowing independent scaling. Snowflake supports SQL and provides features like time travel, data sharing, and automatic optimization.',
    related: ['/mysql-to-snowflake', '/postgresql-to-snowflake'],
  },
  {
    term: 'DDL (Data Definition Language)',
    definition: 'SQL commands used to define database structure, including CREATE TABLE, ALTER TABLE, and DROP TABLE statements. During migration, DDL scripts are generated to recreate schema in the target database.',
    related: [],
  },
  {
    term: 'Schema Analysis',
    definition: 'The process of examining database structure including tables, columns, data types, indexes, and constraints. Schema analysis identifies compatibility issues before migration.',
    related: ['/features'],
  },
  {
    term: 'Data Type Mapping',
    definition: 'Converting data types from source database (e.g., MySQL) to target database (e.g., Snowflake). For example, MySQL DATETIME maps to Snowflake TIMESTAMP_NTZ.',
    related: ['/mysql-to-snowflake', '/mssql-to-snowflake'],
  },
  {
    term: 'OLTP (Online Transaction Processing)',
    definition: 'Database systems optimized for fast, short transactions like INSERT, UPDATE, DELETE. MySQL, PostgreSQL, and SQL Server are OLTP databases. They handle day-to-day operations.',
    related: [],
  },
  {
    term: 'OLAP (Online Analytical Processing)',
    definition: 'Database systems optimized for complex analytical queries on large datasets. Snowflake is an OLAP system designed for reporting, BI, and data analytics workloads.',
    related: [],
  },
  {
    term: 'ETL (Extract, Transform, Load)',
    definition: 'A data integration process that extracts data from source systems, transforms it to fit the target schema, and loads it into the destination. Common in data warehouse migrations.',
    related: [],
  },
  {
    term: 'ELT (Extract, Load, Transform)',
    definition: 'Modern approach where raw data is loaded into the target first, then transformed using the target system\'s processing power. Snowflake\'s architecture is well-suited for ELT.',
    related: [],
  },
  {
    term: 'Incremental Sync',
    definition: 'Migrating only new or changed data since the last sync, rather than full table reloads. Uses timestamps or change tracking to identify modified rows.',
    related: ['/how-it-works'],
  },
  {
    term: 'Bulk Load',
    definition: 'Loading large volumes of data at once, typically from files (CSV, Parquet) staged in cloud storage. Snowflake\'s COPY INTO command is optimized for bulk loading.',
    related: [],
  },
  {
    term: 'VARIANT',
    definition: 'Snowflake data type for storing semi-structured data like JSON, Avro, or XML. MySQL JSON columns typically map to Snowflake VARIANT.',
    related: ['/mysql-to-snowflake'],
  },
  {
    term: 'TIMESTAMP_NTZ',
    definition: 'Snowflake timestamp type without timezone information (NTZ = No Time Zone). MySQL DATETIME and TIMESTAMP typically map to this type.',
    related: ['/mysql-to-snowflake'],
  },
  {
    term: 'Clustering Key',
    definition: 'Snowflake feature that organizes table data to improve query performance. Similar concept to indexes in traditional databases, but managed differently.',
    related: [],
  },
  {
    term: 'Virtual Warehouse',
    definition: 'Snowflake\'s compute resource that executes queries. Warehouses can be started, stopped, and scaled independently of data storage. You pay only when warehouses run.',
    related: [],
  },
  {
    term: 'Time Travel',
    definition: 'Snowflake feature allowing access to historical data at any point within a retention period (up to 90 days). Useful for recovering accidentally deleted data.',
    related: [],
  },
  {
    term: 'Zero-Copy Cloning',
    definition: 'Snowflake feature to instantly create copies of databases, schemas, or tables without duplicating data. Useful for testing migrations without additional storage costs.',
    related: [],
  },
  {
    term: 'Stage',
    definition: 'A Snowflake location for storing files before loading into tables. Can be internal (managed by Snowflake) or external (S3, Azure Blob, GCS).',
    related: [],
  },
  {
    term: 'ENUM',
    definition: 'MySQL data type that stores one value from a predefined list. Not directly supported in Snowflake; typically converted to VARCHAR with a CHECK constraint or lookup table.',
    related: ['/mysql-to-snowflake'],
  },
  {
    term: 'Primary Key',
    definition: 'Column(s) that uniquely identify each row in a table. While Snowflake supports PRIMARY KEY syntax, it\'s not enforced - it\'s metadata for documentation and query optimization.',
    related: [],
  },
  {
    term: 'Data Validation',
    definition: 'Post-migration verification that data was transferred correctly. Includes row count comparison, checksum validation, and sample data verification.',
    related: ['/how-it-works'],
  },
];

export default function GlossaryPage() {
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
            Database Migration Glossary
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Essential terminology for understanding database migrations to Snowflake and cloud data warehouses.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="mb-12 p-6 bg-white border border-gray-200 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="flex flex-wrap gap-2">
            {glossaryTerms.map((item) => (
              <a
                key={item.term}
                href={`#${item.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700"
              >
                {item.term}
              </a>
            ))}
          </div>
        </div>

        {/* Glossary Terms */}
        <div className="space-y-8">
          {glossaryTerms.map((item) => (
            <div
              key={item.term}
              id={item.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              className="bg-white border border-gray-200 rounded-xl p-6 scroll-mt-20"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">{item.term}</h2>
              <p className="text-gray-600 leading-relaxed">{item.definition}</p>
              {item.related.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Related: </span>
                  {item.related.map((link, idx) => (
                    <span key={link}>
                      <Link href={link} className="text-sm text-primary-600 hover:underline">
                        {link.replace('/', '').replace(/-/g, ' ')}
                      </Link>
                      {idx < item.related.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <section className="mt-16 text-center bg-primary-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Start Your Migration?
          </h2>
          <p className="text-primary-100 mb-8">
            Use our free schema analyzer to understand your database before migrating.
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
