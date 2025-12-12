# LegacyToCloud

Database migration platform - Migrate legacy MySQL/PostgreSQL databases to modern cloud platforms.

## Project Structure

```
/
├── backend/           # FastAPI (Python) - API on port 8003
├── frontend/          # Next.js - builds to static HTML
├── www/               # Apache serves this (deployed frontend)
├── config/
│   ├── apache/        # Apache virtual host config
│   └── systemd/       # Backend service for production
├── steps/             # Project documentation & ideas
├── .github/workflows/ # CI/CD - auto deploys on push to master
├── .env.example       # Environment template
└── docker-compose.yml # Local PostgreSQL for development
```

---

## STEP-BY-STEP: Local Development Setup

### Prerequisites

On your Mac, you need:
- **Python 3.11+** (`python3 --version`)
- **Node.js 20+** (`node --version`)
- **Docker Desktop** (for PostgreSQL database)

### Step 1: Start PostgreSQL Database

```bash
cd /Users/alex/Documents/0work/docker/000legacytocloud.com
docker-compose up -d db
```

Verify it's running:
```bash
docker ps
# Should show: ltc_postgres
```

### Step 2: Setup Backend

```bash
# Go to backend folder
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create local .env file
cp ../.env.example .env
```

### Step 3: Run Backend

```bash
# Make sure venv is activated
source venv/bin/activate

# Run FastAPI server
uvicorn app.main:app --reload --port 8003
```

Backend is now running at:
- API: http://localhost:8003
- Docs: http://localhost:8003/api/docs

### Step 4: Setup Frontend (new terminal)

```bash
# Open new terminal, go to frontend
cd /Users/alex/Documents/0work/docker/000legacytocloud.com/frontend

# Install Node dependencies
npm install
```

### Step 5: Run Frontend

```bash
npm run dev
```

Frontend is now running at: http://localhost:3000

---

## Development Workflow

```
1. Edit code locally
2. Test in browser (localhost:3000 + localhost:8003)
3. Commit & push to GitHub
4. GitHub Actions builds & deploys to production
```

### Daily Development

**Terminal 1 - Database (run once):**
```bash
cd /Users/alex/Documents/0work/docker/000legacytocloud.com
docker-compose up -d db
```

**Terminal 2 - Backend:**
```bash
cd /Users/alex/Documents/0work/docker/000legacytocloud.com/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8003
```

**Terminal 3 - Frontend:**
```bash
cd /Users/alex/Documents/0work/docker/000legacytocloud.com/frontend
npm run dev
```

---

## STEP-BY-STEP: Production Server Setup (One-time)

### Step 1: Enable Apache Modules

```bash
sudo a2enmod proxy proxy_http rewrite
```

### Step 2: Update Apache Config

Add API proxy lines to your existing config at `/etc/apache2/sites-available/legacytocloud.conf`:

```apache
# Inside <VirtualHost *:443> section, add:
ProxyPreserveHost On
ProxyPass /api http://127.0.0.1:8003/api
ProxyPassReverse /api http://127.0.0.1:8003/api
```

Or use the complete config from: `config/apache/legacytocloud.conf`

### Step 3: Create PostgreSQL Database

```bash
sudo -u postgres psql
CREATE DATABASE legacytocloud;
CREATE USER ltc_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE legacytocloud TO ltc_user;
\q
```

### Step 4: Setup Backend on Server

```bash
cd /usr/local/www/legacytocloud.com/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 5: Create Production .env

```bash
# Create .env OUTSIDE www/ folder
nano /usr/local/www/legacytocloud.com/.env
```

Content:
```
DATABASE_URL=postgresql+asyncpg://ltc_user:your-secure-password@localhost:5432/legacytocloud
SECRET_KEY=generate-a-long-random-string-here
API_PORT=8003
ENVIRONMENT=production
```

### Step 6: Setup Systemd Service

```bash
sudo cp config/systemd/legacytocloud-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable legacytocloud-api
sudo systemctl start legacytocloud-api
```

### Step 7: Restart Apache

```bash
sudo systemctl restart apache2
```

### Step 8: Setup GitHub Secrets

In your GitHub repo → Settings → Secrets → Actions, add:

| Secret | Value |
|--------|-------|
| `SERVER_HOST` | Your server IP or hostname |
| `SERVER_USER` | SSH username |
| `SERVER_SSH_KEY` | SSH private key content |

---

## Deployment

Push to `master` branch triggers automatic deployment:

```bash
git add .
git commit -m "Your changes"
git push origin master
```

GitHub Actions will:
1. Build frontend to static HTML
2. Deploy to `/usr/local/www/legacytocloud.com/www/`
3. Update backend code
4. Restart API service

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/projects` | GET/POST | List/Create projects |
| `/api/connections` | GET/POST | Manage DB connections |
| `/api/connections/test` | POST | Test DB connection |
| `/api/analysis/run` | POST | Run schema analysis |

---

## Useful Commands

**Check if backend is running:**
```bash
curl http://localhost:8003/api/health
```

**View backend logs (production):**
```bash
sudo journalctl -u legacytocloud-api -f
```

**Restart backend (production):**
```bash
sudo systemctl restart legacytocloud-api
```

**Stop local database:**
```bash
docker-compose down
```
