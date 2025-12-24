#!/bin/bash

# LegacyToCloud - Production Deploy Script
# Usage: ./deploy.sh [all|frontend|backend]
# Default: all

set -e

DEPLOY_DIR="/usr/local/www/legacytocloud.com"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MODE="${1:-all}"

echo "=========================================="
echo "  LegacyToCloud Deploy"
echo "  Mode: $MODE"
echo "=========================================="

deploy_backend() {
    echo ""
    echo "[Backend] Installing dependencies..."
    cd $DEPLOY_DIR/backend
    source venv/bin/activate
    pip install -r requirements.txt --quiet

    echo "[Backend] Running migrations..."
    alembic upgrade head
    deactivate

    echo "[Backend] Restarting service..."
    sudo systemctl restart legacytocloud-api

    echo "[Backend] Done!"
}

deploy_frontend() {
    echo ""
    echo "[Frontend] Installing dependencies..."
    cd "$SCRIPT_DIR/frontend"
    npm install --silent

    echo "[Frontend] Building..."
    STATIC_EXPORT=true NEXT_PUBLIC_API_URL=https://legacytocloud.com/api npm run build

    echo "[Frontend] Copying to www..."
    cp -r out/* $DEPLOY_DIR/www/

    echo "[Frontend] Done!"
}

case $MODE in
    frontend|fe|f)
        deploy_frontend
        ;;
    backend|be|b)
        deploy_backend
        ;;
    all|a|"")
        deploy_backend
        deploy_frontend
        ;;
    *)
        echo "Usage: ./deploy.sh [all|frontend|backend]"
        echo "  all      - Deploy both backend and frontend (default)"
        echo "  frontend - Deploy frontend only (alias: fe, f)"
        echo "  backend  - Deploy backend only (alias: be, b)"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "  Deploy Complete!"
echo "=========================================="
echo ""
echo "Verify: curl https://legacytocloud.com/api/health"
echo ""
