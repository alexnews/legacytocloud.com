# LegacyToCloud Pivot Research: 7 AI/ML Directions

**Date:** 2026-03-31
**Goal:** Find a niche that can (1) earn money, (2) help get a job, (3) teach valuable skills

---

## Your Current Assets

- FastAPI backend with schema analysis, SQL parsing, DDL generation, risk detection
- Live database connectors (MySQL, PostgreSQL, MSSQL)
- Finance analytics pipeline (Alpha Vantage → PG → ClickHouse → API → Dashboard)
- News pipeline (Coollinks MySQL → PostgreSQL → frontend)
- Next.js frontend with dashboard UI
- Production server with PostgreSQL + ClickHouse
- SEO landing pages ranking for migration keywords
- Domain: legacytocloud.com (strong SEO name)

---

## IDEA 1: AI-Powered SQL Code Migration Engine (RECOMMENDED #1)

**What:** Use LLMs to convert stored procedures, functions, and triggers between SQL dialects (T-SQL → PL/pgSQL, PL/SQL → PL/pgSQL). Not just schema DDL (you already do that) but the **procedural code** where 60-80% of migration cost lives.

**Why this is the best fit:**
- You already have SQL parsing, schema analysis, and DDL generation -- this is the natural next step
- AWS SCT converts stored procedures at only 60-70% accuracy. Nobody is using LLMs for the remaining 30-40%
- Ispirer charges $5K-$50K per project and is entirely rule-based
- One enterprise migration project ($20K-$100K) funds months of development

**How to build it:**
1. Use `sqlglot` library for 60-70% of dialect conversion (rule-based)
2. Use Claude/GPT-4 API as fallback for complex cases (cursors, dynamic SQL, vendor-specific functions)
3. Build a side-by-side review UI in your Next.js frontend
4. Auto-generate test cases for converted procedures
5. MVP in 6-8 weeks

**Money path:**
- Free tier: paste a single procedure, get conversion (lead gen)
- SaaS: $99-$499/month for batch conversion + project management
- Consulting: $150-$300/hr for hands-on migration work
- Productized assessment: $2,500-$5,000 per database assessment

**Job market value:**
- Positions you for "AI Data Engineer" roles ($140K-$200K)
- Relevant to: Snowflake, CockroachDB, Neon, Supabase, PlanetScale, AWS DMS team
- Portfolio piece that demonstrates both data engineering AND AI/LLM integration

**Skills you learn:**
- LLM integration (prompt engineering, structured output, evaluation)
- Compiler/parser design (AST manipulation with sqlglot)
- Enterprise consulting and sales

**Difficulty:** Medium. 6-8 weeks to MVP.

**Market size:** Database migration market is ~$5B (2024), growing 15-20% CAGR. Stored procedure conversion is the most painful and expensive part.

---

## IDEA 2: pgvector RAG — "Chat With Your Database"

**What:** Add vector search (pgvector) to your existing PostgreSQL setup. Users connect their database, your tool indexes the schema + sample data as embeddings, then they can ask natural language questions like "What tables contain customer email?" or "Show me all orders from last month."

**Why it's great:**
- pgvector is the hottest PostgreSQL extension in 2025-2026
- Adding this to your project takes 1-2 weekends
- Instantly repositions your portfolio from "data engineer" to "AI-ready data engineer"
- Text-to-SQL is a $500M+ market with players like Vanna.ai, Defog, DataHerald

**How to build it:**
1. Install pgvector extension on your PostgreSQL
2. Embed your schema metadata + column descriptions using OpenAI/Cohere embeddings
3. Build a RAG pipeline: user question → find relevant tables/columns → generate SQL → execute → return results
4. Use Vanna.ai (open source, MIT license) as the text-to-SQL engine
5. Serve via your existing FastAPI backend

**Money path:**
- Free demo on legacytocloud.com (query your own stock/news data)
- SaaS: $29-$99/month per connected database
- Enterprise: $499-$999/month for teams
- Consulting: "Add AI querying to your existing database" at $150/hr

**Job market value:**
- THE most in-demand skill for 2026 data engineering roles
- Every AI Data Engineer job listing mentions RAG, embeddings, or vector databases
- Relevant to: any company building AI products

**Skills you learn:**
- Vector embeddings and semantic search
- RAG architecture (retrieval-augmented generation)
- LLM prompt engineering for SQL generation
- pgvector (increasingly required in PostgreSQL jobs)

**Difficulty:** Low-Medium. 2-4 weeks to MVP.

---

## IDEA 3: AI Schema Documentation & Health Scoring

**What:** Connect to any database, automatically generate complete documentation + a "health score." Most legacy databases have ZERO documentation. Use LLMs to infer relationships, business logic, and generate human-readable descriptions from column names and data patterns.

**How it works:**
1. Connect to database (you already have connectors)
2. Extract schema (you already do this)
3. Sample data from each table
4. Use LLM to generate: table descriptions, column descriptions, inferred relationships (even without FKs), data dictionary
5. Calculate health score: missing PKs, unused indexes, naming violations, normalization issues
6. Output: beautiful HTML/PDF report + ongoing monitoring

**Money path:**
- Free tier: 10 tables, basic report (lead gen funnel)
- SaaS: $29-$49/month for continuous monitoring
- Enterprise: $99-$299/month with team features
- Existing players: dbdocs.io, SchemaSpy -- but none use AI for descriptions

**Job market value:**
- Shows understanding of data governance and metadata management
- Relevant to roles at Alation, Collibra, Atlan, DataHub/Acryl Data
- Data catalog skills are increasingly required for senior data engineer roles

**Skills you learn:**
- Data governance and metadata management
- LLM-powered content generation
- SaaS product development
- Data quality engineering

**Difficulty:** Low. 3-4 weeks to MVP. Most of the infrastructure already exists in your codebase.

---

## IDEA 4: AI Database Performance Advisor

**What:** Analyze slow queries, suggest indexes, detect anti-patterns, and estimate cost savings. Think "EverSQL but open source + AI-powered." EverSQL was acquired by Aiven in 2023, leaving a market gap.

**How it works:**
1. Connect to PostgreSQL/MySQL (you have connectors)
2. Read pg_stat_statements / slow query log
3. Use LLM to analyze query patterns and suggest optimizations
4. Auto-detect: missing indexes, N+1 queries, full table scans, unused indexes
5. Generate "before/after" performance estimates
6. Dashboard with historical trends

**Money path:**
- Free tier: analyze 10 queries
- SaaS: $49-$149/month per database
- Consulting: $200/hr for performance optimization engagements
- Competitors: pganalyze ($100-$500/month), EverSQL (acquired), Aiven AI -- market has gaps

**Job market value:**
- Database performance is a senior/staff-level skill
- "Database Reliability Engineer (DBRE)" roles pay $140K-$190K
- Relevant to: PlanetScale, Neon, Supabase, any company with PostgreSQL at scale

**Skills you learn:**
- Query optimization and execution plans
- Database internals (PostgreSQL pg_stat, MySQL EXPLAIN)
- Performance engineering
- Monitoring and observability

**Difficulty:** Medium. 4-6 weeks to MVP.

---

## IDEA 5: PII Detection & GDPR Compliance Scanner

**What:** AI-powered scanning of databases for sensitive data (emails, SSNs, credit cards, addresses, health data). Auto-classify columns, generate compliance reports, suggest anonymization strategies.

**Why it matters:**
- GDPR fines reached $2.1B in 2023. Companies are terrified.
- BigID ($246M raised) dominates enterprise but charges $100K+/year
- Nothing exists at the mid-market level ($50-$500/month)
- Every database migration MUST include PII assessment — natural addon to your tool

**How to build it:**
1. Connect to database (existing connectors)
2. Sample data from each column
3. Use regex patterns for known PII formats (SSN, email, credit card)
4. Use LLM to classify ambiguous columns (e.g., "notes" field containing addresses)
5. Generate GDPR/CCPA compliance report
6. Suggest: anonymization, encryption, masking strategies

**Money path:**
- Free tier: scan 5 tables
- SaaS: $49-$199/month (mid-market)
- Enterprise: $499-$999/month with audit trails
- Pre-migration addon: include PII scan with every migration assessment (+$500-$1,000)

**Job market value:**
- Security + data engineering = premium salary ($160K-$220K)
- "Data Privacy Engineer" is an emerging hot title
- Relevant to: any regulated industry (finance, healthcare, insurance)

**Skills you learn:**
- Data privacy and compliance (GDPR, CCPA, HIPAA)
- Classification and ML-based detection
- Security engineering fundamentals

**Difficulty:** Medium. 4-6 weeks to MVP.

---

## IDEA 6: Real-Time Migration Validation Agent

**What:** An AI agent that continuously compares source and target databases during/after migration. Proves data integrity, catches drift, generates test cases automatically.

**Why it matters:**
- Data validation is the most expensive part of migration (often 30% of total cost)
- Currently done manually: write SQL to compare counts, checksums, sample rows
- An automated agent that does this saves weeks of work per migration
- Datafold does data diffing but charges enterprise prices and isn't AI-powered

**How to build it:**
1. Connect to both source and target databases simultaneously
2. Table-by-table comparison: row counts, checksums, statistical profiles
3. AI-generated test cases: "Compare orders total by month between source and target"
4. Anomaly detection: flag rows that don't match
5. Continuous monitoring: detect post-migration drift
6. Generate validation report with confidence scores

**Money path:**
- Free tier: validate 3 tables
- SaaS: $99-$299/month during migration
- Addon to consulting: include validation with every migration engagement
- Enterprise: $499/month for ongoing drift detection

**Job market value:**
- Data quality engineering is a growing specialty
- Shows testing discipline (valued by all engineering managers)
- Relevant to: Monte Carlo, Soda, Great Expectations ecosystem

**Skills you learn:**
- Data quality and testing methodologies
- Statistical comparison techniques
- Agent/autonomous AI patterns
- Cross-database querying

**Difficulty:** Medium-High. 6-8 weeks to MVP.

---

## IDEA 7: Micro-Course + Open Source Tool Combo

**What:** Extract your PostgreSQL-to-ClickHouse sync logic into an open source tool (`pg2click`), then build a paid course around it: "Build a Production Data Pipeline with Python, PostgreSQL, and ClickHouse."

**Why it works:**
- No good open source tool exists for PostgreSQL → ClickHouse sync
- No course exists that teaches this specific, in-demand stack
- The tool gets GitHub stars → the course gets students → both generate consulting leads
- Low risk: course revenue + consulting leads while building reputation

**How to build it:**
1. Extract pg2click as standalone Python package (PyPI)
2. Write README with architecture diagram
3. Record 10-15 video lessons (your actual pipeline as curriculum)
4. Host on Teachable/Podia ($49-$149 price) or Udemy ($29-$49)
5. Write 5 blog posts as free content funnel

**Money path:**
- Course: $2K-$10K/month after audience building (3-6 months)
- Open source reputation → consulting leads at $150/hr
- Speaking opportunities at data engineering conferences
- Potential: Snowflake/ClickHouse/Databricks sponsor the content

**Job market value:**
- Published author/instructor carries weight in interviews
- Open source contributor with real users
- Teaching forces deep understanding of the technology

**Skills you learn:**
- Content creation and marketing
- Open source project management
- Public speaking and communication
- Deep PostgreSQL + ClickHouse internals

**Difficulty:** Low. 4-6 weeks for tool extraction + course recording.

---

## Comparison Matrix

| Idea | Earn Money | Get Job | Learn Skills | Time to MVP | Difficulty | Leverages Existing Code |
|------|-----------|---------|-------------|-------------|------------|------------------------|
| 1. SQL Code Migration | $$$$ | +++++ | ++++ | 6-8 weeks | Medium | 90% |
| 2. pgvector RAG | $$ | +++++ | +++++ | 2-4 weeks | Low-Med | 70% |
| 3. Schema Docs/Health | $$ | +++ | +++ | 3-4 weeks | Low | 85% |
| 4. Performance Advisor | $$$ | ++++ | +++++ | 4-6 weeks | Medium | 60% |
| 5. PII/GDPR Scanner | $$$ | ++++ | ++++ | 4-6 weeks | Medium | 65% |
| 6. Validation Agent | $$$ | +++ | ++++ | 6-8 weeks | Med-High | 50% |
| 7. Course + OSS Tool | $$ | +++ | +++ | 4-6 weeks | Low | 80% |

---

## Recommended Strategy: Phased Approach

### Phase 1: Quick Wins (Weeks 1-4)
- **Add pgvector RAG** to your existing project (Idea 2) — 1-2 weekends
- **Write 3 blog posts** about your pipeline architecture
- **Get AWS Data Engineer Associate cert** (study 20 min/day)
- This alone transforms your portfolio for job applications

### Phase 2: Core Product (Weeks 5-12)
- **Build the SQL Code Migration Engine** (Idea 1) — this is the money maker
- **Add PII scanning** as a pre-migration step (Idea 5) — natural addon
- **Launch productized assessment** at $2,500 per database
- **Start consulting** on Upwork at $100/hr

### Phase 3: Scale (Months 4-6)
- **Add Schema Documentation** generator (Idea 3)
- **Extract pg2click** as open source tool (Idea 7)
- **Record course** while building all of the above
- **Apply to AI Data Engineer roles** with a portfolio that now demonstrates: LLM integration, RAG, vector search, SQL parsing, data pipelines, and cloud databases

---

## The Single Best Move

If you can only do ONE thing: **Add pgvector + RAG over your news articles database, then write a blog post about it.** This takes one weekend and instantly makes you relevant to the highest-paying data engineering roles in 2026. Every "AI Data Engineer" job listing mentions RAG and vector databases. Your stock data pipeline + news articles + vector search = a portfolio that no bootcamp graduate can match.

Then build the SQL Code Migration Engine for money. That's the $5B market where you already have infrastructure.

---

## Key Certifications to Get (Priority Order)

1. **AWS Data Engineer Associate** — $150, 2-4 weeks study, most requested cert
2. **dbt Analytics Engineering** — Free, 1 week, modern data stack signal
3. **Snowflake SnowPro Core** — $175, your tool targets Snowflake
4. **Google Professional Data Engineer** — $200, broader scope

---

## Salary Benchmarks for Target Roles

| Role | Base Salary (US) | Your Readiness |
|------|-----------------|----------------|
| Data Engineer | $130K-$170K | Ready now |
| AI Data Engineer | $140K-$200K | After adding pgvector/RAG |
| ML Platform Engineer | $160K-$220K | After adding ML component |
| Database Reliability Engineer | $140K-$190K | Ready now |
| Data Modernization Consultant | $130K-$180K + bonuses | Ready now |
| Independent Consultant | $150-$300/hr | After building portfolio |
