# LegacyToCloud

**Domain:** legacytocloud.com
**Owner:** Alex Kargin
**Status:** Active — building database file converter
**Last Updated:** 2026-04-05

## What This Is

LegacyToCloud is a database migration platform with three core features:

1. **Database File Converter** (main product) — Upload CSV, Excel, SQLite, SQL dumps, or DBF files and convert to CSV, XLSX, MySQL, PostgreSQL, or SQLite. No registration required. Free up to 10MB. Inspired by rebasedata.com.

2. **Migration Tooling** — Analyzes legacy MySQL/MariaDB/Aurora/MSSQL schemas and generates DDL for Snowflake migration. Includes risk detection (missing PKs, ENUM types, large tables, encoding issues), live database connection testing, and SQL file upload analysis.

3. **Finance Analytics Pipeline** — Production-grade OLTP-to-OLAP demo: Alpha Vantage API → PostgreSQL → ClickHouse → FastAPI → Next.js dashboard. Tracks 4 stock symbols with 6 technical indicators.

Additionally: news articles from Coollinks MySQL, RAG-powered article search (pgvector), dbt analytics models, and an analytics dashboard.

## Tech Stack

| Component | Technology | Port/Details |
|-----------|-----------|--------------|
| Frontend | Next.js 14, React 18, Tailwind CSS | Static export → www/ |
| Backend | FastAPI, SQLAlchemy (async), Pydantic | Port 8003 |
| Database | PostgreSQL (native) + pgvector | Schema: `pipeline` |
| Analytics DB | ClickHouse (native) | Database: `pipeline` |
| File Conversion | sqlglot, pandas, openpyxl, dbfread, sqlite3 | No external services |
| News Source | Coollinks MySQL (external) | `pipeline_articles` table |
| Web Server | Apache (reverse proxy) | SSL via Let's Encrypt |
| CI/CD | GitHub Actions | Auto-deploy on push to master |

## Current Status

- Database file converter live: 6 source formats × 5 targets = 30 conversion paths (`/convert`)
- Migration tooling: schema analysis, DDL generation, risk detection
- Finance pipeline demo: ingestion, transformation, API, dashboard
- News section: 453 articles from Coollinks, with pgvector embeddings
- RAG chat: keyword search fallback when embedding model unavailable (`/chat`)
- dbt project: staging/mart models, SQL practice exercises
- Analytics dashboard (`/analytics`)
- SEO pages: 5 migration guides + glossary + FAQ + tips
- Google Search Console, Bing Webmaster, Google Analytics (G-9TD57H49VG)

## Key Links

- Production: https://www.legacytocloud.com
- Converter: https://www.legacytocloud.com/convert
- API docs: https://www.legacytocloud.com/api/docs
- Demo dashboard: https://www.legacytocloud.com/demo/dashboard
- Server path: /usr/local/www/legacytocloud.com
- Server: white (162.217.147.94)
