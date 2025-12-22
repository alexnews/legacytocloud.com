# Project Context for AI Agents

Use this to start conversations with AI coding assistants.

## Project

**Name:** LegacyToCloud
**Purpose:** Database migration platform - migrate legacy MySQL/PostgreSQL to cloud

## Tech Stack

| Component | Technology |
|-----------|------------|
| **API** | FastAPI (Python 3.11) |
| **UI** | Next.js 14 (React) - static export |
| **Database** | PostgreSQL (native, NOT Docker) |
| **Web Server** | Apache with reverse proxy |
| **Process Manager** | systemd |

## Production Server

- **OS:** Ubuntu 22.04
- **Path:** `/usr/local/www/legacytocloud.com/`
- **Domain:** legacytocloud.com
- **API Port:** 8003

## Directory Structure

```
/usr/local/www/legacytocloud.com/
├── backend/          # FastAPI Python code
│   ├── venv/         # Python virtual environment
│   ├── app/          # Application code
│   └── requirements.txt
├── www/              # Static frontend (Apache serves this)
├── .env              # Production environment variables
└── config/
    ├── apache/       # Apache virtual host configs
    └── systemd/      # legacytocloud-api.service
```

## Local Development (Mac)

- Docker is ONLY for local PostgreSQL database
- Frontend runs with `npm run dev`
- Backend runs with `uvicorn app.main:app --port 8003`

## Production Deployment

- NO Docker on production server
- Frontend: `npm run build` with `STATIC_EXPORT=true`, copy `out/` to `www/`
- Backend: systemd service `legacytocloud-api`
- CI/CD: GitHub Actions on push to master

## Key Commands

**Build frontend for production:**
```bash
cd frontend
STATIC_EXPORT=true NEXT_PUBLIC_API_URL=https://legacytocloud.com/api npm run build
```

**Restart backend on server:**
```bash
sudo systemctl restart legacytocloud-api
```

**Check backend logs:**
```bash
sudo journalctl -u legacytocloud-api -f
```

## Important Notes

- Production uses native PostgreSQL, NOT Docker
- Frontend exports to static HTML (no Node.js server in production)
- Apache proxies `/api/*` requests to FastAPI on port 8003
