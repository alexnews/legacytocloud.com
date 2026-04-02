# Current Plan

**Last Updated:** 2026-04-02

## Status: Active — Building Database File Converter (rebasedata.com competitor)

New direction: online database file conversion tool. Upload a file → pick target format → download converted file. No registration, no AI, no paid APIs. Pure file transformation. Inspired by rebasedata.com ($89 one-time / $79/month, 700K+ conversions, 2000+ customers).

**Our edge:** we already have SQL parsing, schema analysis, and risk detection. Modern UI. `sqlglot` does real SQL dialect conversion. We show "here's what will break" — nobody else does.

---

## Phase 1: MVP Converter (NOW — target: 1-2 weeks)

**Goal:** Working converter for the 6 easiest source formats

### Backend: `backend/app/api/converter.py` (new FastAPI router)

**Architecture:**
- POST `/api/convert` — multipart upload, query param `outputFormat`
- Detect input format by file extension
- Parse/convert using Python libraries
- Return ZIP file with converted output
- Rate limit: 5 conversions/day per IP, 10MB file size limit (free tier)

**Source formats to support (Phase 1):**

| # | Format | Extension(s) | Python Library | Notes |
|---|--------|-------------|---------------|-------|
| 1 | CSV | .csv | pandas | Trivial |
| 2 | Excel | .xls, .xlsx | pandas + openpyxl + xlrd | Trivial |
| 3 | SQLite | .sqlite, .db, .sqlite3 | sqlite3 (built-in) | Trivial |
| 4 | SQL dump | .sql | sqlglot | Parse DDL+data, detect dialect |
| 5 | DBF/DBase | .dbf | dbfread | Easy, legacy format |
| 6 | T-SQL dump | .sql (auto-detect) | sqlglot | SQL Server dialect |

**Target formats (Phase 1):**

| # | Format | Library | Output |
|---|--------|---------|--------|
| 1 | CSV | pandas | One .csv per table |
| 2 | XLSX | pandas + openpyxl | One .xlsx per table |
| 3 | MySQL | sqlglot | Single .sql dump |
| 4 | PostgreSQL | sqlglot | Single .sql dump |
| 5 | SQLite | sqlite3 | Single .sqlite file |

**Conversion matrix: 6 sources × 5 targets = 30 conversions (minus same-to-same)**

### Backend implementation steps:

1. **Install new deps** — add to `requirements.txt`:
   ```
   sqlglot>=25.0.0
   dbfread>=2.0.7
   xlrd>=2.0.1
   ```
   (pandas and openpyxl already installed)

2. **Create converter module** — `backend/app/converter/` with:
   - `router.py` — FastAPI endpoint (upload + convert + return ZIP)
   - `detect.py` — detect input format from extension + content sniffing
   - `readers.py` — parse each source format into a common internal format:
     ```python
     # Common format: list of tables, each table = name + columns + rows
     ConvertedData = list[TableData]
     TableData = { "name": str, "columns": list[str], "rows": list[list], "ddl": str | None }
     ```
   - `writers.py` — write internal format to each target format
   - `sql_converter.py` — sqlglot-based SQL dialect conversion (DDL + DML)

3. **Wire into FastAPI** — add router to `app/main.py` with prefix `/api`

4. **File handling:**
   - Save uploaded file to temp dir
   - Process and convert
   - ZIP the output
   - Return ZIP as streaming response
   - Clean up temp files

### Frontend: `/convert` page + SEO landing pages

5. **Main converter page** — `frontend/src/app/convert/page.tsx`:
   - Drag-and-drop upload zone
   - Auto-detect source format, show it
   - Dropdown to pick target format
   - "Convert" button
   - Download link when done
   - Show schema analysis / risk warnings (our differentiator!)

6. **SEO landing pages** — `frontend/src/app/convert/[slug]/page.tsx`:
   - Template-based: `/convert/csv-to-mysql`, `/convert/sqlite-to-postgresql`, etc.
   - Generate ~100 pages from the conversion matrix (include aliases like psql, pgsql, postgres, postgresql)
   - Each page has: title, description, format-specific tips, the same upload widget
   - Add all to sitemap

7. **Update site nav** — add "Convert" link to header

### Deploy:
8. Commit + push
9. SSH to server:
   ```bash
   cd /usr/local/www/legacytocloud.com
   git pull
   cd backend && source venv/bin/activate
   pip install -r requirements.txt
   sudo systemctl restart legacytocloud-api
   cd ../frontend && npm install && npm run build
   ```

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
