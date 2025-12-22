#!/bin/bash

# LegacyToCloud Deployment Script
# Run this script to set up and deploy the project

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo "=========================================="
echo "  LegacyToCloud Deployment Script"
echo "=========================================="

# Step 1: Environment setup
echo ""
echo "[1/7] Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "  Created .env from .env.example"
    echo "  IMPORTANT: Edit .env with your production values!"
else
    echo "  .env already exists"
fi

# Step 2: Start Docker containers (Postgres + Redis)
echo ""
echo "[2/7] Starting Docker containers..."
docker-compose up -d
echo "  Waiting for database to be ready..."
sleep 5

# Step 3: Backend - Python virtual environment
echo ""
echo "[3/7] Setting up Python backend..."
cd "$PROJECT_DIR/backend"

if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "  Created virtual environment"
fi

source venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo "  Backend dependencies installed"

# Step 4: Run database migrations (if alembic is configured)
echo ""
echo "[4/7] Checking database migrations..."
if [ -d "alembic" ] && [ -f "alembic.ini" ]; then
    alembic upgrade head
    echo "  Migrations applied"
else
    echo "  No migrations to run (alembic not configured)"
fi

# Step 5: Frontend - npm install and build
echo ""
echo "[5/7] Setting up frontend..."
cd "$PROJECT_DIR/frontend"

if command -v npm &> /dev/null; then
    npm install
    echo "  Frontend dependencies installed"

    echo ""
    echo "[6/7] Building frontend..."
    npm run build
    echo "  Frontend built successfully"
else
    echo "  WARNING: npm not found, skipping frontend setup"
fi

# Step 7: Start services
echo ""
echo "[7/7] Starting services..."
cd "$PROJECT_DIR/backend"
source venv/bin/activate

echo ""
echo "=========================================="
echo "  Deployment Complete!"
echo "=========================================="
echo ""
echo "To start the services, run these in separate terminals:"
echo ""
echo "  Backend:"
echo "    cd backend && source venv/bin/activate"
echo "    uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload"
echo ""
echo "  Frontend:"
echo "    cd frontend"
echo "    npm run dev      # Development mode"
echo "    npm run start    # Production mode (after build)"
echo ""
echo "Services:"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - Backend API: http://localhost:8003"
echo "  - Frontend: http://localhost:3000"
echo ""
