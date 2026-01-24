# Project Context for AI Agents

Use this to start conversations with AI coding assistants.

## Project

**Name:** LegacyToCloud
**Purpose:** Database migration platform - analyze MySQL/MariaDB/Aurora schemas and generate Snowflake DDL

## Tech Stack

| Component | Technology |
|-----------|------------|
| **API** | FastAPI (Python 3.10) |
| **UI** | Next.js 14 (React) - static export |
| **Database** | PostgreSQL (native, NOT Docker) |
| **Web Server** | Apache with reverse proxy |
| **Process Manager** | systemd |

## Production Server

- **OS:** Ubuntu 22.04
- **Path:** `/usr/local/www/legacytocloud.com/`
- **Domain:** www.legacytocloud.com (SSL cert is for www only!)
- **API Port:** 8003

## Current Features (as of Dec 26, 2025)

### SEO Landing Pages
- `/mysql-to-snowflake`
- `/mssql-to-snowflake`
- `/postgresql-to-snowflake`
- `/mariadb-to-snowflake`
- `/aurora-to-snowflake`

### Dashboard
- User registration/login
- Project creation (MySQL→Snowflake, etc.)
- Database connections management

### Schema Analysis (Two Methods)
1. **Connect to Database** - Direct connection with credentials
2. **Upload Schema File** - Upload .sql file, no credentials needed

### Snowflake DDL Generator
- Parses MySQL CREATE TABLE statements
- Maps MySQL types to Snowflake types
- Generates downloadable .sql file with Snowflake DDL

## Directory Structure

```
/usr/local/www/legacytocloud.com/
├── backend/
│   ├── venv/
│   ├── app/
│   │   ├── api/           # FastAPI routes
│   │   ├── services/      # Business logic
│   │   │   ├── schema_analyzer.py   # Live DB analysis
│   │   │   ├── sql_parser.py        # Parse .sql files
│   │   │   └── ddl_generator.py     # Generate Snowflake DDL
│   │   ├── models/        # SQLAlchemy models
│   │   └── schemas/       # Pydantic schemas
│   └── requirements.txt
├── frontend/
│   └── src/app/           # Next.js pages
├── www/                   # Static frontend (Apache serves)
├── config/
│   ├── apache/
│   └── systemd/
├── steps/                 # Session logs & plans
├── deploy.sh              # Deployment script
└── .env
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/app/services/sql_parser.py` | Parse MySQL CREATE TABLE from .sql files |
| `backend/app/services/ddl_generator.py` | Generate Snowflake DDL |
| `backend/app/api/analysis.py` | Analysis endpoints (upload, quick, run) |
| `frontend/src/app/dashboard/projects/[[...slug]]/client.tsx` | Project detail page with upload UI |
| `deploy.sh` | Deploy script with options |

## Deploy Commands

```bash
cd /usr/local/www/legacytocloud.com
git pull
./deploy.sh              # Both backend & frontend
./deploy.sh frontend     # Frontend only
./deploy.sh backend      # Backend only

# Verify
curl https://www.legacytocloud.com/api/health
```

## Known Issues & Fixes

### Apache SPA Routing
Dashboard project pages need .htaccess for client-side routing:
```bash
# This is auto-created by deploy.sh now
cat /usr/local/www/legacytocloud.com/www/dashboard/projects/.htaccess
```

### SSL Certificate
Certificate is for `www.legacytocloud.com` only. Always use `www.` in URLs:
```bash
# Correct
NEXT_PUBLIC_API_URL=https://www.legacytocloud.com/api

# Wrong - will cause SSL errors
NEXT_PUBLIC_API_URL=https://legacytocloud.com/api
```

### Python 3.10 Compatibility
Server runs Python 3.10. Avoid backslashes in f-string expressions:
```python
# Bad - syntax error in Python 3.10
f'"{"\", \"".join(items)}"'

# Good
items_str = '", "'.join(items)
f'"{items_str}"'
```

## Session Logs

- `steps/SESSION_2025-12-22.md` - Initial deploy, fixed alembic
- `steps/SESSION_2025-12-26.md` - SEO pages, schema upload, DDL generator

## Next Steps (TODO)

1. Test schema upload with real MySQL schema files
2. Add PostgreSQL and MSSQL parsers to sql_parser.py
3. Add stored procedure/view analysis
4. Add data migration planning (not just schema)
