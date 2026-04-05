# Current Plan

**Last Updated:** 2026-04-05

## Status: Active — Building Database File Converter (rebasedata.com competitor)

New direction: online database file conversion tool. Upload a file → pick target format → download converted file. No registration, no AI, no paid APIs. Pure file transformation. Inspired by rebasedata.com ($89 one-time / $79/month, 700K+ conversions, 2000+ customers).

**Our edge:** we already have SQL parsing, schema analysis, and risk detection. Modern UI. `sqlglot` does real SQL dialect conversion. We show "here's what will break" — nobody else does.

---

## Phase 1: MVP Converter (DONE — 2026-04-02)

**Built:** `backend/app/converter/` module with full pipeline.

| Component | File | Status |
|-----------|------|--------|
| API endpoint | `converter/router.py` | Done — POST `/api/convert?outputFormat=X` |
| Format detection | `converter/detect.py` | Done — extension-based + SQL dialect sniffing |
| Data model | `converter/models.py` | Done — ConvertedData / TableData / ColumnInfo |
| Readers | `converter/readers.py` | Done — CSV, Excel, SQLite, SQL dump, DBF |
| Writers | `converter/writers.py` | Done — CSV, XLSX, MySQL, PostgreSQL, SQLite |
| Frontend | `frontend/src/app/convert/page.tsx` | Done — drag-drop, format picker, download |
| Nav | `SiteHeader.tsx` | Done — "Convert" link added |

**Conversion matrix: 6 sources × 5 targets = 30 paths**

Sources: CSV (.csv/.tsv), Excel (.xls/.xlsx), SQLite (.sqlite/.db), SQL dump (.sql), DBF (.dbf)
Targets: CSV, XLSX, MySQL, PostgreSQL, SQLite

### Still to do in Phase 1:
- [ ] Deploy to production server
- [ ] Add rate limiting (5/day per IP)
- [ ] Add schema analysis warnings to conversion output (our differentiator)
- [ ] SEO landing pages — `/convert/[slug]` template pages

---

## Phase 2: Add Access + Firebird (weeks 3-4)

- Install `mdbtools` on server: `sudo apt install mdbtools`
- Use subprocess to call `mdb-tables`, `mdb-export`, `mdb-schema`
- Adds MDB, MDE, ACCDB support (Microsoft Access — highest search volume)
- Install `fdb` or `firebird-driver` for Firebird/Interbase (FDB, FBK, GDB, GBK, IB)
- This brings source count to ~12 formats

---

## Phase 3: SEO Blitz (week 4-5)

- Generate 200+ landing pages from template (all format × format combos with aliases)
- Add format-specific content: tips, common issues, example output previews
- Submit to Google Search Console + Bing
- Target keywords like "convert mdb to postgresql online", "access to mysql converter"
- Blog posts: "How to migrate from Access to PostgreSQL" etc.

---

## Phase 4: Monetization (week 6+)

- Stripe checkout (no full auth system needed)
- Free: 10MB, 5/day per IP
- One-time: $49 for 7 days unlimited (undercut rebasedata's $89)
- Monthly: $39/month unlimited (undercut rebasedata's $79)
- API access for paid users (POST with API key)

---

## Previous Work (Completed)

### Original MVP
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

### AI/ML Features (2026-04-01)
- [x] pgvector RAG chat with keyword search fallback (`/chat` page)
- [x] 453 articles embedded in pgvector
- [x] dbt project with staging/mart models
- [x] Analytics dashboard (`/analytics` page)
- [x] Graceful fallback when embedder/Ollama unavailable

