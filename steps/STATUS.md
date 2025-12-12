# LegacyToCloud - Project Status

## Current Status: MVP Complete

### What's Built

**Backend (FastAPI - Python)**
- User authentication (register, login, JWT tokens)
- Project management (CRUD)
- Database connections (MSSQL, MySQL, PostgreSQL, Snowflake)
- Connection testing
- Schema analysis (tables, columns, indexes, migration risks)
- PostgreSQL metadata database

**Frontend (Next.js - React)**
- Landing page
- Login/Register pages
- Dashboard with project list
- Connection management page
- Project detail page with source/target selection
- Schema analysis view with risks
- Favicon, robots.txt, sitemap.xml

**Migration Types (3 Cloud Paths)**
| Source | Target | Status |
|--------|--------|--------|
| MSSQL (SQL Server) | Snowflake | Ready |
| MySQL | Snowflake | Ready |
| PostgreSQL | Snowflake | Ready |

---

## Next Steps

| Priority | Task | Status |
|----------|------|--------|
| 1 | Deploy to production | Pending |
| 2 | Add Snowflake connector | Pending |
| 3 | Build migration execution | Pending |
| 4 | Add landing page content | Pending |
| 5 | Test with real databases | Pending |

---

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, Alembic, PostgreSQL
- **Frontend:** Next.js 14, React, Tailwind CSS
- **Database:** PostgreSQL (metadata), Redis (future caching)
- **Deployment:** GitHub Actions, Apache reverse proxy
- **Server:** FreeBSD with Python (no Node.js on prod)
