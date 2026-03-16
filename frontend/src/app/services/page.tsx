'use client';

import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';

const migrations = [
  {
    source: 'MSSQL',
    sourceLabel: 'SQL Server',
    sourceColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    target: 'Snowflake',
    targetColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    description:
      'Migrate SQL Server workloads to Snowflake with automated schema conversion, data type mapping, and DDL generation.',
    features: [
      'T-SQL to Snowflake SQL translation',
      'Clustered/non-clustered index analysis',
      'Identity column to sequence mapping',
      'Stored procedure dependency scanning',
      'VARCHAR(MAX) / NVARCHAR handling',
      'Schema + table DDL generation',
    ],
    includes: ['Schema analysis', 'Type mapping', 'DDL generation', 'Risk assessment'],
  },
  {
    source: 'MySQL',
    sourceLabel: 'MySQL',
    sourceColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    target: 'Snowflake',
    targetColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    description:
      'Move MySQL analytics workloads to Snowflake with full schema translation, including enum types, auto-increment, and charset handling.',
    features: [
      'ENUM / SET type conversion',
      'AUTO_INCREMENT to AUTOINCREMENT mapping',
      'TINYINT(1) boolean detection',
      'Character set and collation handling',
      'Foreign key relationship mapping',
      'View and trigger documentation',
    ],
    includes: ['Schema analysis', 'Type mapping', 'DDL generation', 'Risk assessment'],
  },
  {
    source: 'PostgreSQL',
    sourceLabel: 'PostgreSQL',
    sourceColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    target: 'Snowflake',
    targetColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    description:
      'Scale your PostgreSQL analytics to Snowflake with intelligent type mapping for arrays, JSONB, custom types, and advanced features.',
    features: [
      'JSONB / Array type handling',
      'Custom type and domain resolution',
      'Serial to AUTOINCREMENT mapping',
      'Extension dependency analysis',
      'Partitioned table strategy',
      'Materialized view conversion plan',
    ],
    includes: ['Schema analysis', 'Type mapping', 'DDL generation', 'Risk assessment'],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800/50 to-slate-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Database Migration{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Automated schema analysis, intelligent type mapping, and DDL generation for migrating
            legacy databases to Snowflake cloud data warehouse.
          </p>
        </div>
      </section>

      {/* Migration Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {migrations.map((m) => (
              <div
                key={m.source}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8 hover:border-slate-600 transition-colors"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-bold border ${m.sourceColor}`}
                  >
                    {m.sourceLabel}
                  </span>
                  <svg
                    className="w-6 h-6 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-bold border ${m.targetColor}`}
                  >
                    {m.target}
                  </span>
                </div>

                <p className="text-slate-300 mb-6 max-w-3xl">{m.description}</p>

                <div className="grid sm:grid-cols-2 gap-8">
                  {/* What's Included */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      What&apos;s Included
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {m.includes.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-full text-xs text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {m.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                          <svg
                            className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">See the Pipeline in Action</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Explore the live finance analytics dashboard to see how data flows through
            the full pipeline from API ingestion to interactive visualizations.
          </p>
          <Link
            href="/demo/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
          >
            View Live Dashboard
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
