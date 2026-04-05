# LegacyToCloud

Database migration platform with online file converter. Convert between CSV, Excel, SQLite, SQL dumps, and DBF formats. Also: schema analysis, migration planning, finance analytics pipeline, RAG-powered news search.

## Tech Stack
- Frontend: Next.js 14 / React / Tailwind (static export, port 3000 dev)
- Backend: FastAPI / SQLAlchemy async (port 8003)
- Database: PostgreSQL (native, schema `pipeline`) + pgvector, ClickHouse (native, database `pipeline`)
- File conversion: sqlglot, pandas, openpyxl, dbfread, sqlite3
- News source: Coollinks MySQL (external)
- Server: Ubuntu 22.04 (white), Apache reverse proxy
- CI/CD: GitHub Actions → SSH deploy

## Key Rules
- PostgreSQL and ClickHouse are native on server — never add to docker-compose
- Use `.env.local` for frontend build config, never inline env vars
- Always commit+push before giving server deploy instructions
- Test code against actual data/schema before pushing
- DB user on server is `ltc_user` (needs `-h localhost` for password auth)

## Documentation
All docs in `docs/` folder:
- `docs/OVERVIEW.md` — project overview and status
- `docs/ARCHITECTURE.md` — tech stack, APIs, database, pipeline, directory structure
- `docs/DEPLOYMENT.md` — deploy process, server paths, cron
- `docs/PLAN.md` — current priorities and next steps (converter phases)
- `docs/SEO.md` — keywords, sitemap, search console, converter SEO strategy
- `docs/RESEARCH_PIVOT.md` — 7 AI/ML direction proposals (background research)
