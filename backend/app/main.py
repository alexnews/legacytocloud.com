from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api import health, auth, projects, connections, analysis

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


@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "version": "0.1.0",
        "status": "running",
        "docs": "/api/docs"
    }
