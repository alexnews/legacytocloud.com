import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ - Database Migration Questions | LegacyToCloud',
  description: 'Frequently asked questions about migrating MySQL, PostgreSQL, and SQL Server databases to Snowflake. Learn about migration time, costs, downtime, and more.',
  keywords: 'database migration FAQ, Snowflake migration questions, MySQL to Snowflake FAQ, migration cost, migration time',
  openGraph: {
    title: 'Database Migration FAQ - LegacyToCloud',
    description: 'Answers to common questions about migrating to Snowflake',
    url: 'https://www.legacytocloud.com/faq',
    type: 'website',
  },
};

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'How long does a database migration to Snowflake take?',
        a: 'Migration time depends on data volume, complexity, and network speed. A simple schema with 10GB of data can migrate in hours. Large enterprise databases with 10TB+ may take days to weeks. Our schema analyzer provides time estimates based on your specific database.',
      },
      {
        q: 'Can I migrate to Snowflake without downtime?',
        a: 'Yes, using incremental sync. First, perform initial bulk load while your source database runs normally. Then use change data capture (CDC) or timestamp-based sync to keep Snowflake updated. Finally, switch over during a brief maintenance window (often under 5 minutes).',
      },
      {
        q: 'What databases can I migrate from?',
        a: 'LegacyToCloud supports migrations from MySQL, MariaDB, PostgreSQL, Amazon Aurora, and Microsoft SQL Server to Snowflake. Each source has specific type mappings and considerations we handle automatically.',
      },
      {
        q: 'Do I need to modify my application code?',
        a: 'Snowflake uses standard SQL, so most analytical queries work with minimal changes. However, if your application uses database-specific features (stored procedures, triggers), those may need rewriting. Our analysis report identifies these areas.',
      },
    ],
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'What happens to MySQL ENUM types in Snowflake?',
        a: 'Snowflake doesn\'t have an ENUM type. We convert ENUMs to VARCHAR and document the allowed values. You can enforce constraints using Snowflake CHECK constraints or create a lookup table for validation.',
      },
      {
        q: 'How are stored procedures handled?',
        a: 'Snowflake supports stored procedures in JavaScript, Python, Java, and Snowflake Scripting (SQL). MySQL/PostgreSQL procedures need to be rewritten. Our analysis identifies all procedures and provides migration guidance.',
      },
      {
        q: 'What about indexes and primary keys?',
        a: 'Snowflake automatically optimizes query performance through micro-partitioning and doesn\'t require traditional indexes. Primary keys are metadata-only (not enforced). We recommend clustering keys for large tables based on common query patterns.',
      },
      {
        q: 'How is JSON data migrated?',
        a: 'MySQL JSON columns map to Snowflake VARIANT type, which natively supports semi-structured data. You can query JSON fields directly using dot notation or bracket syntax. VARIANT can hold up to 16MB of data.',
      },
      {
        q: 'Are foreign keys supported?',
        a: 'Snowflake supports foreign key syntax but doesn\'t enforce referential integrity. This is common in data warehouses for performance. The constraints serve as documentation and can be used by BI tools.',
      },
    ],
  },
  {
    category: 'Cost & Pricing',
    questions: [
      {
        q: 'How much does Snowflake cost?',
        a: 'Snowflake uses consumption-based pricing. You pay separately for storage (~$23/TB/month) and compute (credits based on warehouse size). A small warehouse costs ~$2/hour when running. You can pause warehouses when not in use.',
      },
      {
        q: 'How much does LegacyToCloud cost?',
        a: 'Schema analysis is free. Migration planning starts at $199 for small databases. Enterprise migrations with hands-on support range from $3,000 to $50,000+ depending on complexity. Contact us for a custom quote.',
      },
      {
        q: 'Will my costs go up after migrating to Snowflake?',
        a: 'Often costs go down because you eliminate server maintenance, licensing, and over-provisioned hardware. Snowflake\'s separation of storage and compute means you only pay for what you use. We provide cost estimates before migration.',
      },
    ],
  },
  {
    category: 'Security',
    questions: [
      {
        q: 'Is my data secure during migration?',
        a: 'Yes. We use encrypted connections (TLS) for all database access. Data in transit is encrypted. We never store your actual data - only schema metadata for analysis. For bulk loads, data goes directly from your source to your Snowflake account.',
      },
      {
        q: 'Do you need production database access?',
        a: 'No. You can upload a schema file (mysqldump --no-data) for analysis without providing credentials. For live analysis, we recommend connecting to a read replica or using a read-only database user.',
      },
      {
        q: 'Is Snowflake SOC 2 compliant?',
        a: 'Yes, Snowflake is SOC 2 Type II, HIPAA, PCI-DSS, and FedRAMP compliant. It offers features like column-level encryption, data masking, and row-level access policies for sensitive data.',
      },
    ],
  },
];

// Generate JSON-LD for FAQPage schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap(category =>
    category.questions.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    }))
  ),
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about migrating your database to Snowflake.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {faqs.map((category) => (
            <a
              key={category.category}
              href={`#${category.category.toLowerCase()}`}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700"
            >
              {category.category}
            </a>
          ))}
        </div>

        {/* FAQ Sections */}
        {faqs.map((category) => (
          <div key={category.category} id={category.category.toLowerCase()} className="mb-12 scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, idx) => (
                <details
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden group"
                >
                  <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between hover:bg-gray-50">
                    <h3 className="font-semibold text-gray-900 pr-4">{faq.q}</h3>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div className="bg-gray-100 rounded-xl p-8 text-center mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h2>
          <p className="text-gray-600 mb-4">We're here to help with your migration planning.</p>
          <Link href="/contact" className="inline-block text-primary-600 font-medium hover:underline">
            Contact Us
          </Link>
        </div>

        {/* CTA */}
        <section className="text-center bg-primary-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Analyze Your Database?
          </h2>
          <p className="text-primary-100 mb-8">
            Get a free schema analysis and see exactly what your migration involves.
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
