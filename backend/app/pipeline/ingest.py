"""Alpha Vantage ingestion pipeline for daily stock prices."""

from __future__ import annotations

import logging
from datetime import datetime

import httpx
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.pipeline.models import PipelineRun, RawStockPrice

logger = logging.getLogger(__name__)

ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query"


async def fetch_daily_prices(symbol: str, api_key: str) -> list[dict]:
    """Fetch TIME_SERIES_DAILY from Alpha Vantage and return a flat list of dicts."""
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol,
        "outputsize": "compact",
        "apikey": api_key,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(ALPHA_VANTAGE_BASE, params=params)
        resp.raise_for_status()
        data = resp.json()

    time_series = data.get("Time Series (Daily)", {})
    rows: list[dict] = []
    for date_str, values in time_series.items():
        rows.append(
            {
                "symbol": symbol,
                "trade_date": date_str,
                "open": float(values["1. open"]),
                "high": float(values["2. high"]),
                "low": float(values["3. low"]),
                "close": float(values["4. close"]),
                "volume": int(values["5. volume"]),
            }
        )
    return rows


async def ingest_symbol(
    symbol: str,
    db: AsyncSession,
    api_key: str,
) -> int:
    """Fetch prices for a single symbol and upsert into PostgreSQL.

    Returns the number of rows inserted/updated.
    """
    rows = await fetch_daily_prices(symbol, api_key)
    inserted = 0

    for row in rows:
        stmt = (
            pg_insert(RawStockPrice)
            .values(
                symbol=row["symbol"],
                trade_date=row["trade_date"],
                open=row["open"],
                high=row["high"],
                low=row["low"],
                close=row["close"],
                volume=row["volume"],
                source="alpha_vantage",
            )
            .on_conflict_do_update(
                constraint="uq_raw_stock_symbol_date",
                set_={
                    "open": row["open"],
                    "high": row["high"],
                    "low": row["low"],
                    "close": row["close"],
                    "volume": row["volume"],
                    "source": "alpha_vantage",
                    "ingested_at": datetime.utcnow(),
                },
            )
        )
        await db.execute(stmt)
        inserted += 1

    await db.commit()
    return inserted


async def run_ingestion(db: AsyncSession) -> PipelineRun:
    """Orchestrate ingestion for all configured symbols."""
    settings = get_settings()
    api_key = settings.alpha_vantage_api_key

    run = PipelineRun(run_type="ingest", status="running", started_at=datetime.utcnow())
    db.add(run)
    await db.commit()
    await db.refresh(run)

    if not api_key:
        logger.warning(
            "ALPHA_VANTAGE_API_KEY is not set -- skipping live ingestion."
        )
        run.status = "failed"
        run.error_message = "Missing API key"
        run.completed_at = datetime.utcnow()
        await db.commit()
        return run

    total_processed = 0
    total_inserted = 0

    try:
        for symbol in settings.pipeline_symbols:
            logger.info("Ingesting %s ...", symbol)
            rows = await fetch_daily_prices(symbol, api_key)
            total_processed += len(rows)
            inserted = await ingest_symbol(symbol, db, api_key)
            total_inserted += inserted

        run.status = "completed"
        run.rows_processed = total_processed
        run.rows_inserted = total_inserted
        run.completed_at = datetime.utcnow()
    except Exception as exc:
        logger.exception("Ingestion failed: %s", exc)
        run.status = "failed"
        run.error_message = str(exc)[:500]
        run.completed_at = datetime.utcnow()

    await db.commit()
    await db.refresh(run)
    return run
