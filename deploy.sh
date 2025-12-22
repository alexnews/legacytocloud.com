#!/bin/bash

# LegacyToCloud - Production Redeploy Script for Ubuntu 22.04
# This script redeploys code from GitHub to existing production server
# Does NOT touch database or existing configuration

set -e

DEPLOY_DIR="/usr/local/www/legacytocloud.com"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=========================================="
echo "  LegacyToCloud Code Redeploy"
echo "  Server: Ubuntu 22.04"
echo "=========================================="

# Step 1: Backend - install Python dependencies
echo ""
echo "[1/4] Installing backend dependencies..."
cd $DEPLOY_DIR/backend
source venv/bin/activate
pip install -r requirements.txt
deactivate

# Step 2: Run database migrations
echo ""
echo "[2/4] Running database migrations..."
cd $DEPLOY_DIR/backend
source venv/bin/activate
alembic upgrade head
deactivate

# Step 3: Build and deploy frontend
echo ""
echo "[3/4] Building frontend..."
cd "$SCRIPT_DIR/frontend"
npm install
STATIC_EXPORT=true NEXT_PUBLIC_API_URL=https://www.legacytocloud.com/api npm run build
echo "  Copying to www folder..."
cp -r out/* $DEPLOY_DIR/www/

# Step 4: Restart backend service
echo ""
echo "[4/4] Restarting backend service..."
sudo systemctl restart legacytocloud-api

echo ""
echo "=========================================="
echo "  Redeploy Complete!"
echo "=========================================="
echo ""
echo "Verify:"
echo "  curl https://legacytocloud.com/api/health"
echo ""
