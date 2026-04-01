# LegacyToCloud

Database migration platform + data engineering portfolio. Analyzes legacy database schemas, generates migration plans, and showcases a real-time finance analytics pipeline.

## Tech Stack
- Frontend: Next.js 14 / React / Tailwind (static export, port 3000 dev)
- Backend: FastAPI / SQLAlchemy async (port 8003)
- Database: PostgreSQL (native, schema `pipeline`), ClickHouse (native, database `pipeline`)
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
- `docs/ARCHITECTURE.md` — tech stack, APIs, database, pipeline
- `docs/DEPLOYMENT.md` — deploy process, server paths, cron
- `docs/PLAN.md` — current priorities and next steps
- `docs/SEO.md` — keywords, sitemap, search console, analytics
