"""Refresh pipeline: ingest from Alpha Vantage and transform to ClickHouse.

Usage (from backend directory):
    venv/bin/python -m scripts.refresh_pipeline

Designed to be called from cron. Exits 0 on success, 1 on failure.
"""

import asyncio
import logging
import os
import sys
from pathlib import Path

# Ensure backend is on the path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

# Load .env from project root so DATABASE_URL etc. are available
from dotenv import load_dotenv
load_dotenv(backend_dir.parent / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


async def main() -> int:
    from app.core.database import async_session
    from app.pipeline.ingest import run_ingestion
    from app.pipeline.transform import run_transform

    # 1. Ingest
    async with async_session() as db:
        logger.info("Starting ingestion...")
        run = await run_ingestion(db)
        if run.status == "failed":
            logger.error("Ingestion failed: %s", run.error_message)
            return 1
        logger.info("Ingestion complete: %d rows processed.", run.rows_processed or 0)

    # 2. Transform
    async with async_session() as db:
        logger.info("Starting transform...")
        run = await run_transform(db)
        if run.status == "failed":
            logger.error("Transform failed: %s", run.error_message)
            return 1
        logger.info("Transform complete: %d rows processed.", run.rows_processed or 0)

    logger.info("Pipeline refresh done.")
    return 0


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
