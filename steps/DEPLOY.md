# Deploy to Production

## Overview

- **Production server:** FreeBSD
- **Domain:** legacytocloud.com
- **Path:** `/usr/local/www/legacytocloud.com/`
- **Web server:** Apache (reverse proxy to FastAPI)
- **Backend port:** 8003

## Architecture

```
Internet → Apache (port 80/443)
              ├── /api/* → FastAPI (port 8003)
              └── /* → Static files (www/)
```

---

## Step 1: Prepare Local Build

### Frontend (build static files)
```bash
cd frontend
STATIC_EXPORT=true NEXT_PUBLIC_API_URL=https://legacytocloud.com/api npm run build
```

This creates `out/` folder with static HTML/CSS/JS.

**Important:** The `STATIC_EXPORT=true` environment variable is required for static export.

### Backend (no build needed)
Python runs directly from source.

---

## Step 2: Set Up Production Server

### 2.1 Create directory structure
```bash
ssh user@legacytocloud.com

# Create directories
mkdir -p /usr/local/www/legacytocloud.com/www
mkdir -p /usr/local/www/legacytocloud.com/backend
mkdir -p /usr/local/www/legacytocloud.com/config
```

### 2.2 Install Python dependencies
```bash
cd /usr/local/www/legacytocloud.com/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2.3 Create .env file
```bash
# /usr/local/www/legacytocloud.com/.env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/legacytocloud
SECRET_KEY=your-super-secret-key-change-this
ENCRYPTION_KEY=your-32-byte-encryption-key-here
CORS_ORIGINS=https://legacytocloud.com
API_HOST=0.0.0.0
API_PORT=8003
```

### 2.4 Set up PostgreSQL database
```bash
# Create database
createdb legacytocloud

# Run migrations
cd /usr/local/www/legacytocloud.com/backend
source venv/bin/activate
alembic upgrade head
```

---

## Step 3: Configure Apache

### 3.1 Virtual host config
File: `/usr/local/etc/apache24/Includes/legacytocloud.conf`

```apache
<VirtualHost *:80>
    ServerName legacytocloud.com
    ServerAlias www.legacytocloud.com

    DocumentRoot /usr/local/www/legacytocloud.com/www

    # API proxy
    ProxyPreserveHost On
    ProxyPass /api http://127.0.0.1:8003/api
    ProxyPassReverse /api http://127.0.0.1:8003/api

    # Static files
    <Directory /usr/local/www/legacytocloud.com/www>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # SPA fallback - serve appropriate index.html for client-side routing
    RewriteEngine On

    # Skip rewrite for existing files and directories
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # Projects catch-all: /dashboard/projects/* -> /dashboard/projects/index.html
    RewriteRule ^dashboard/projects/.+ /dashboard/projects/index.html [L]

    # General SPA fallback for other routes
    RewriteRule ^dashboard$ /dashboard/index.html [L]
    RewriteRule ^dashboard/connections$ /dashboard/connections/index.html [L]
    RewriteRule ^login$ /login/index.html [L]
    RewriteRule ^register$ /register/index.html [L]

    # Root fallback
    RewriteRule ^ /index.html [L]

    ErrorLog /var/log/httpd/legacytocloud-error.log
    CustomLog /var/log/httpd/legacytocloud-access.log combined
</VirtualHost>
```

### 3.2 Enable modules
```bash
# Ensure these modules are enabled in httpd.conf
LoadModule proxy_module libexec/apache24/mod_proxy.so
LoadModule proxy_http_module libexec/apache24/mod_proxy_http.so
LoadModule rewrite_module libexec/apache24/mod_rewrite.so
```

### 3.3 Restart Apache
```bash
service apache24 restart
```

---

## Step 4: Set Up systemd Service (or rc.d on FreeBSD)

### FreeBSD rc.d script
File: `/usr/local/etc/rc.d/legacytocloud`

```sh
#!/bin/sh

# PROVIDE: legacytocloud
# REQUIRE: LOGIN postgresql
# KEYWORD: shutdown

. /etc/rc.subr

name="legacytocloud"
rcvar="legacytocloud_enable"

load_rc_config $name

: ${legacytocloud_enable:="NO"}
: ${legacytocloud_user:="www"}
: ${legacytocloud_dir:="/usr/local/www/legacytocloud.com/backend"}
: ${legacytocloud_env:="/usr/local/www/legacytocloud.com/.env"}

pidfile="/var/run/${name}.pid"
command="/usr/sbin/daemon"
command_args="-p ${pidfile} -u ${legacytocloud_user} ${legacytocloud_dir}/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8003"

start_precmd="cd ${legacytocloud_dir} && export \$(cat ${legacytocloud_env} | xargs)"

run_rc_command "$1"
```

### Enable service
```bash
chmod +x /usr/local/etc/rc.d/legacytocloud
echo 'legacytocloud_enable="YES"' >> /etc/rc.conf
service legacytocloud start
```

---

## Step 5: GitHub Actions CI/CD

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [master]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Build Frontend
        run: |
          cd frontend
          npm ci
          NEXT_PUBLIC_API_URL=https://legacytocloud.com/api npm run build
        env:
          STATIC_EXPORT: 'true'

      - name: Deploy to Server
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          source: "frontend/out/*,backend/*"
          target: "/usr/local/www/legacytocloud.com/"
          strip_components: 1

      - name: Restart Backend
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /usr/local/www/legacytocloud.com/backend
            source venv/bin/activate
            pip install -r requirements.txt
            alembic upgrade head
            service legacytocloud restart
```

### GitHub Secrets Required
Add these in GitHub repo → Settings → Secrets:
- `SERVER_HOST`: legacytocloud.com (or IP)
- `SERVER_USER`: deploy user
- `SERVER_SSH_KEY`: private SSH key

---

## Step 6: SSL Certificate (Let's Encrypt)

```bash
# Install certbot
pkg install py39-certbot py39-certbot-apache

# Get certificate
certbot --apache -d legacytocloud.com -d www.legacytocloud.com

# Auto-renewal (add to crontab)
0 0 * * * /usr/local/bin/certbot renew --quiet
```

---

## Quick Deploy Checklist

- [ ] Build frontend locally: `cd frontend && STATIC_EXPORT=true NEXT_PUBLIC_API_URL=https://legacytocloud.com/api npm run build`
- [ ] Create production .env file
- [ ] Set up PostgreSQL database
- [ ] Run migrations: `alembic upgrade head`
- [ ] Configure Apache virtual host
- [ ] Set up backend service
- [ ] Configure GitHub secrets
- [ ] Push to master branch
- [ ] Verify site is live
- [ ] Set up SSL certificate

---

## Troubleshooting

### Backend not starting
```bash
# Check logs
tail -f /var/log/legacytocloud.log

# Test manually
cd /usr/local/www/legacytocloud.com/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8003
```

### Frontend 404 errors
- Check Apache rewrite rules
- Ensure `index.html` exists in `www/`
- Check file permissions

### API proxy not working
```bash
# Test API directly
curl http://127.0.0.1:8003/api/health

# Check Apache error log
tail -f /var/log/httpd/legacytocloud-error.log
```
