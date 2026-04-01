# LegacyToCloud

**Domain:** legacytocloud.com
**Owner:** Alex Kargin
**Status:** Paused (live but not actively developed)
**Last Updated:** 2026-03-31

## What This Is

LegacyToCloud is a database migration platform and data engineering portfolio project. It has two main components:

1. **Migration Tooling** — Analyzes legacy MySQL/MariaDB/Aurora/MSSQL schemas and generates DDL for Snowflake migration. Includes risk detection (missing PKs, ENUM types, large tables, encoding issues), live database connection testing, and SQL file upload analysis.

2. **Finance Analytics Pipeline** — A production-grade demo showing OLTP-to-OLAP architecture: Alpha Vantage API → Python ingestion → PostgreSQL → ClickHouse → FastAPI → Next.js dashboard with Chart.js visualizations. Tracks 4 stock symbols with 6 technical indicators.

Additionally, the site pulls and displays industry news articles from a Coollinks MySQL database.

## Tech Stack

| Component | Technology | Port/Details |
|-----------|-----------|--------------|
| Frontend | Next.js 14, React 18, Tailwind CSS | Static export → www/ |
| Backend | FastAPI, SQLAlchemy (async), Pydantic | Port 8003 |
| Database | PostgreSQL (native) | Schema: `pipeline` |
| Analytics | ClickHouse (native) | Database: `pipeline` |
| News Source | Coollinks MySQL (external) | `pipeline_articles` table |
| Web Server | Apache (reverse proxy) | SSL via Let's Encrypt |
| CI/CD | GitHub Actions | Auto-deploy on push to master |

## Current Status

- MVP complete: auth, project management, connection testing, schema analysis, DDL generation
- Finance pipeline demo working: ingestion, transformation, API, dashboard
- News section live: pulls from Coollinks, displays articles with images
- SEO pages live: migration guides (MySQL, MSSQL, PostgreSQL, MariaDB, Aurora → Snowflake), glossary, FAQ, tips
- Google Search Console and Bing Webmaster verified
- Google Analytics active (G-9TD57H49VG)
- Project is paused — no active development, waiting for a new direction

## Key Links

- Production: https://www.legacytocloud.com
- API docs: https://www.legacytocloud.com/api/docs
- Demo dashboard: https://www.legacytocloud.com/demo/dashboard
- Server path: /usr/local/www/legacytocloud.com
- Server: white (162.217.147.94)
