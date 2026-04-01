# Deployment

**Last Updated:** 2026-03-31
**Server:** white (162.217.147.94)
**SSH:** `ssh dundee@white`

## Server Paths

| Path | Purpose |
|------|---------|
| /usr/local/www/legacytocloud.com/ | Project root |
| /usr/local/www/legacytocloud.com/www/ | Apache DocumentRoot (built frontend) |
| /usr/local/www/legacytocloud.com/backend/ | FastAPI app |
| /usr/local/www/legacytocloud.com/backend/venv/ | Python virtualenv |
| /usr/local/www/legacytocloud.com/.env | Environment config |
| /usr/local/www/legacytocloud.com/www/uploads/news/ | Downloaded news images |
| /var/log/apache2/sites/legacytocloud_com_*.log | Apache logs |

## Services

| Service | Command | Description |
|---------|---------|-------------|
| legacytocloud-api | `sudo systemctl restart legacytocloud-api` | FastAPI backend (uvicorn on port 8003) |
| apache2 | `sudo systemctl reload apache2` | Web server |

Check service status:
```bash
sudo systemctl status legacytocloud-api
journalctl -u legacytocloud-api --since "10 minutes ago"
```

## Deploy Process

### Automated (CI/CD)
Push to `master` triggers GitHub Actions:
1. Backend build check (Python 3.11)
2. Frontend static export (Node 20)
3. SCP frontend build to server www/
4. SSH: git pull, pip install, restart service

### Manual Deploy
```bash
# On server (ssh dundee@white)
cd /usr/local/www/legacytocloud.com
git pull origin master

# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
deactivate
sudo systemctl restart legacytocloud-api

# Frontend (build locally or on server)
cd ../frontend
npm install
STATIC_EXPORT=true NEXT_PUBLIC_API_URL=https://www.legacytocloud.com/api npm run build
cp -r out/* ../www/
```

### Quick deploy script
```bash
./deploy.sh          # Deploy all
./deploy.sh backend  # Backend only (alias: be, b)
./deploy.sh frontend # Frontend only (alias: fe, f)
```

## Cron Jobs (user: dundee)

```cron
# Stock data pipeline refresh (weekdays 6pm)
0 18 * * 1-5 cd /usr/local/www/legacytocloud.com/backend && venv/bin/python -m scripts.refresh_pipeline >> /tmp/ltc-pipeline.log 2>&1

# News pull + sitemap (weekdays 6:05pm)
5 18 * * 1-5 cd /usr/local/www/legacytocloud.com/backend && venv/bin/python -m scripts.pull_news >> /tmp/ltc-news.log 2>&1
```

## Database

PostgreSQL is native on the server (not Docker).

```bash
# Connect as ltc_user (must use -h localhost for password auth)
psql -U ltc_user -h localhost -d legacytocloud

# Check pipeline schema
psql -U ltc_user -h localhost -d legacytocloud -c "\dt pipeline.*"
```

ClickHouse is also native:
```bash
clickhouse-client --database=pipeline
```

## Database Migrations

```bash
cd /usr/local/www/legacytocloud.com/backend
source venv/bin/activate
alembic upgrade head      # Apply pending migrations
alembic revision --autogenerate -m "description"  # Create new migration
```

## SSL Certificates

Let's Encrypt via certbot, auto-renewed:
```
/etc/letsencrypt/live/www.legacytocloud.com/fullchain.pem
/etc/letsencrypt/live/www.legacytocloud.com/privkey.pem
```

## Verify Deployment

```bash
curl https://www.legacytocloud.com/api/health
curl https://www.legacytocloud.com/api/news?limit=1
```
