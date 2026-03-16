import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api import health, auth, projects, connections, analysis
from app.pipeline.router import router as pipeline_router

logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="Database migration platform - Migrate legacy databases to modern cloud platforms",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(connections.router, prefix="/api/connections", tags=["Connections"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Schema Analysis"])
app.include_router(pipeline_router, prefix="/api/pipeline", tags=["Pipeline"])


@app.on_event("startup")
async def startup_seed():
    """Auto-seed pipeline data on startup if tables are empty."""
    try:
        from app.core.database import async_session
        from app.pipeline.seed_data import seed_postgres, seed_clickhouse
        from app.pipeline.clickhouse import init_clickhouse

        # Initialise ClickHouse schema
        try:
            init_clickhouse()
        except Exception as exc:
            logger.warning("ClickHouse init skipped (not available): %s", exc)

        # Seed PostgreSQL
        async with async_session() as db:
            await seed_postgres(db)

        # Seed ClickHouse
        try:
            seed_clickhouse()
        except Exception as exc:
            logger.warning("ClickHouse seeding skipped: %s", exc)

    except Exception as exc:
        logger.warning("Auto-seed skipped: %s", exc)


@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "version": "0.1.0",
        "status": "running",
        "docs": "/api/docs"
    }
