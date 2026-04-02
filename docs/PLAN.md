# Current Plan

**Last Updated:** 2026-04-02

## Status: Active — Building AI/ML features (Phase 1)

Direction chosen: combine existing platform with AI/ML to target "AI Data Engineer" roles and consulting revenue. See `RESEARCH_PIVOT.md` for full analysis.

---

### Phase 1: Quick Wins (NOW — started 2026-04-01)

**Goal:** Transform portfolio for job applications + learn high-value skills

#### Done
- [x] pgvector RAG chat — embedder, retriever, LLM client, chat UI (`/chat` page)
- [x] Migration 005 — pgvector embeddings table with vector column
- [x] Embed articles script (`backend/scripts/embed_articles.py`)
- [x] dbt project — staging + mart models, sources, seeds, tests
- [x] SQL practice exercises (`dbt_project/EXERCISES.md`)
- [x] Analytics dashboard frontend (`/analytics` page)
- [x] Analytics API endpoint (`backend/app/api/analytics.py`)
- [x] Updated site nav with Chat + Analytics links

#### To Do
- [ ] Deploy RAG chat to server (Ollama + sentence-transformers setup)
- [ ] Run `embed_articles.py` on server to populate embeddings
- [ ] Test RAG chat end-to-end on production
- [ ] Deploy dbt project to server, run models against production PG
- [ ] Deploy analytics dashboard to production
- [ ] Write blog post about the RAG + pgvector architecture
- [ ] Study for dbt Analytics Engineering certification
- [ ] Study for AWS Data Engineer Associate certification

---

### Phase 2: Core Product (Weeks 5-12)

**Goal:** Build the money-maker — AI SQL Code Migration Engine

- [ ] Use `sqlglot` for rule-based dialect conversion (60-70%)
- [ ] Add Claude/GPT-4 API as fallback for complex cases (cursors, dynamic SQL)
- [ ] Build side-by-side review UI in Next.js
- [ ] Auto-generate test cases for converted procedures
- [ ] Add PII scanning as a pre-migration step
- [ ] Launch productized assessment ($2,500 per database)
- [ ] Start consulting on Upwork

---

### Phase 3: Scale (Months 4-6)

- [ ] Add AI Schema Documentation generator
- [ ] Extract pg2click as open source tool (PyPI)
- [ ] Record video course on the pipeline architecture
- [ ] Apply to AI Data Engineer roles

---

### Completed (Original MVP)
- [x] FastAPI backend with auth, projects, connections, schema analysis
- [x] SQL file upload and parsing
- [x] Snowflake DDL generation with type mapping
- [x] Risk detection (missing PKs, ENUM types, large tables, encoding)
- [x] Live database connection testing (MySQL, PostgreSQL, MSSQL)
- [x] Finance analytics pipeline (Alpha Vantage → PG → ClickHouse → API → Dashboard)
- [x] News section (Coollinks MySQL → PostgreSQL → frontend)
- [x] SEO landing pages (5 migration guides + glossary + FAQ + tips)
- [x] Google Search Console + Bing Webmaster verification
- [x] Google Analytics (G-9TD57H49VG)
- [x] GitHub Actions CI/CD
- [x] Dynamic sitemap generator
- [x] IndexNow integration
