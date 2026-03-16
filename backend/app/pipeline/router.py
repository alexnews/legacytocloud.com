"""FastAPI router for pipeline endpoints."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.pipeline.clickhouse import execute_clickhouse, get_clickhouse_client
from app.pipeline.models import PipelineMetric, PipelineRun
from app.pipeline.schemas import (
    ArchitectureNode,
    ArchitectureResponse,
    MovingAverages,
    PipelineHealth,
    PipelineMetrics,
    PipelineRunResponse,
    StockOHLCV,
    StockWithChange,
    VolumeAnalysis,
)

logger = logging.getLogger(__name__)

router = APIRouter()


# ---------------------------------------------------------------------------
# Health & metrics
# ---------------------------------------------------------------------------

@router.get("/health", response_model=PipelineHealth)
async def pipeline_health(db: AsyncSession = Depends(get_db)):
    """Check connectivity to PostgreSQL and ClickHouse and report basic stats."""
    pg_ok = False
    ch_ok = False
    total_rows = 0
    symbols_tracked = 0
    last_sync = None

    # PostgreSQL check
    try:
        await db.execute(text("SELECT 1"))
        pg_ok = True
    except Exception:
        logger.warning("PostgreSQL health check failed.")

    # ClickHouse check
    try:
        result = execute_clickhouse("SELECT count() FROM pipeline.stock_ohlcv")
        ch_ok = True
        total_rows = result[0][0] if result else 0
        sym_result = execute_clickhouse("SELECT uniq(symbol) FROM pipeline.stock_ohlcv")
        symbols_tracked = sym_result[0][0] if sym_result else 0
    except Exception:
        logger.warning("ClickHouse health check failed.")

    # Last sync from metrics
    try:
        row = await db.execute(
            select(PipelineMetric.value).where(PipelineMetric.key == "last_sync")
        )
        val = row.scalar_one_or_none()
        if val:
            last_sync = datetime.fromisoformat(val)
    except Exception:
        pass

    status = "healthy" if (pg_ok and ch_ok) else "degraded"

    return PipelineHealth(
        status=status,
        clickhouse_connected=ch_ok,
        postgres_connected=pg_ok,
        last_sync=last_sync,
        total_rows=total_rows,
        symbols_tracked=symbols_tracked,
    )


@router.get("/metrics", response_model=PipelineMetrics)
async def pipeline_metrics(db: AsyncSession = Depends(get_db)):
    """Return operational metrics for the pipeline."""
    # Fetch all metric rows
    result = await db.execute(select(PipelineMetric))
    metrics_map: dict[str, str] = {}
    for m in result.scalars().all():
        metrics_map[m.key] = m.value

    # Pipeline runs in last 24h
    cutoff = datetime.utcnow() - timedelta(hours=24)
    runs_count = await db.scalar(
        select(func.count()).select_from(PipelineRun).where(PipelineRun.started_at >= cutoff)
    )

    total_rows = int(metrics_map.get("total_rows", "0"))
    last_sync = metrics_map.get("last_sync")
    avg_transform = metrics_map.get("avg_transform_seconds")

    # Get actual symbol list from ClickHouse
    try:
        sym_rows = execute_clickhouse("SELECT DISTINCT symbol FROM pipeline.stock_ohlcv ORDER BY symbol")
        symbols = [r[0] for r in sym_rows]
    except Exception:
        symbols = []

    # Data freshness
    freshness_hours = None
    if last_sync:
        try:
            last_dt = datetime.fromisoformat(last_sync)
            freshness_hours = round((datetime.utcnow() - last_dt).total_seconds() / 3600, 2)
        except Exception:
            pass

    return PipelineMetrics(
        total_rows=total_rows,
        symbols=symbols,
        last_sync=last_sync,
        data_freshness_hours=freshness_hours,
        pipeline_runs_24h=runs_count or 0,
        avg_transform_seconds=float(avg_transform) if avg_transform else None,
    )


# ---------------------------------------------------------------------------
# Stock data endpoints (read from ClickHouse)
# ---------------------------------------------------------------------------

@router.get("/stocks", response_model=list[StockWithChange])
async def list_stocks():
    """Return the latest price and daily change for each tracked symbol."""
    query = """
        SELECT
            symbol,
            argMax(close, trade_date) AS latest_price,
            argMax(daily_return, trade_date) AS daily_change_pct,
            argMax(volume, trade_date) AS volume
        FROM pipeline.stock_ohlcv
        GROUP BY symbol
        ORDER BY symbol
    """
    rows = execute_clickhouse(query)
    results = []
    for symbol, latest_price, daily_change_pct, volume in rows:
        daily_change = round(latest_price * daily_change_pct, 2)
        results.append(
            StockWithChange(
                symbol=symbol,
                latest_price=round(latest_price, 2),
                daily_change=daily_change,
                daily_change_pct=round(daily_change_pct * 100, 2),
                volume=int(volume),
            )
        )
    return results


@router.get("/stocks/{symbol}", response_model=list[StockOHLCV])
async def get_stock_history(symbol: str, days: int = Query(default=90, ge=1, le=365)):
    """Return OHLCV data for a specific symbol over the last N days."""
    query = """
        SELECT symbol, trade_date, open, high, low, close, volume, daily_return, intraday_range
        FROM pipeline.stock_ohlcv
        WHERE symbol = %(symbol)s AND trade_date >= today() - %(days)s
        ORDER BY trade_date
    """
    rows = execute_clickhouse(query, {"symbol": symbol, "days": days})
    if not rows:
        raise HTTPException(status_code=404, detail=f"No data found for symbol {symbol}")
    return [
        StockOHLCV(
            symbol=r[0], trade_date=r[1], open=r[2], high=r[3], low=r[4],
            close=r[5], volume=int(r[6]), daily_return=r[7], intraday_range=r[8],
        )
        for r in rows
    ]


@router.get("/stocks/{symbol}/analytics", response_model=list[MovingAverages])
async def get_stock_analytics(symbol: str, days: int = Query(default=90, ge=1, le=365)):
    """Return moving averages and technical indicators for a symbol."""
    query = """
        SELECT symbol, trade_date, sma_20, sma_50, ema_12, ema_26,
               macd, macd_signal, macd_histogram, rsi_14
        FROM pipeline.stock_moving_averages
        WHERE symbol = %(symbol)s AND trade_date >= today() - %(days)s
        ORDER BY trade_date
    """
    rows = execute_clickhouse(query, {"symbol": symbol, "days": days})
    if not rows:
        raise HTTPException(status_code=404, detail=f"No analytics found for symbol {symbol}")
    return [
        MovingAverages(
            symbol=r[0], trade_date=r[1], sma_20=r[2], sma_50=r[3],
            ema_12=r[4], ema_26=r[5], macd=r[6], macd_signal=r[7],
            macd_histogram=r[8], rsi_14=r[9],
        )
        for r in rows
    ]


@router.get("/stocks/{symbol}/volume", response_model=list[VolumeAnalysis])
async def get_volume_analysis(symbol: str, days: int = Query(default=90, ge=1, le=365)):
    """Return volume analysis for a symbol."""
    query = """
        SELECT symbol, trade_date, volume, avg_volume_20, volume_ratio
        FROM pipeline.stock_volume_analysis
        WHERE symbol = %(symbol)s AND trade_date >= today() - %(days)s
        ORDER BY trade_date
    """
    rows = execute_clickhouse(query, {"symbol": symbol, "days": days})
    if not rows:
        raise HTTPException(status_code=404, detail=f"No volume data found for symbol {symbol}")
    return [
        VolumeAnalysis(
            symbol=r[0], trade_date=r[1], volume=int(r[2]),
            avg_volume_20=r[3], volume_ratio=r[4],
        )
        for r in rows
    ]


# ---------------------------------------------------------------------------
# Pipeline runs
# ---------------------------------------------------------------------------

@router.get("/runs", response_model=list[PipelineRunResponse])
async def list_runs(db: AsyncSession = Depends(get_db)):
    """Return the last 20 pipeline runs."""
    result = await db.execute(
        select(PipelineRun).order_by(PipelineRun.started_at.desc()).limit(20)
    )
    return result.scalars().all()


# ---------------------------------------------------------------------------
# Trigger endpoints (protected)
# ---------------------------------------------------------------------------

@router.post("/ingest", response_model=PipelineRunResponse)
async def trigger_ingest(
    db: AsyncSession = Depends(get_db),
    _user=Depends(get_current_user),
):
    """Trigger a full ingestion run (requires authentication)."""
    from app.pipeline.ingest import run_ingestion

    run = await run_ingestion(db)
    return run


@router.post("/transform", response_model=PipelineRunResponse)
async def trigger_transform(
    db: AsyncSession = Depends(get_db),
    _user=Depends(get_current_user),
):
    """Trigger a full transform run (requires authentication)."""
    from app.pipeline.transform import run_transform

    run = await run_transform(db)
    return run


# ---------------------------------------------------------------------------
# Architecture description
# ---------------------------------------------------------------------------

@router.get("/architecture", response_model=ArchitectureResponse)
async def get_architecture():
    """Return a static description of the pipeline architecture for visualisation."""
    nodes = [
        ArchitectureNode(
            id="alpha_vantage",
            name="Alpha Vantage API",
            type="source",
            description="External market data provider for daily OHLCV stock prices",
            tech="REST API",
            metrics={"rate_limit": "5 calls/min (free tier)"},
        ),
        ArchitectureNode(
            id="ingestion",
            name="Python Ingestion",
            type="process",
            description="Fetches daily prices and upserts into PostgreSQL staging table",
            tech="Python / httpx / SQLAlchemy",
            metrics={"symbols": 4},
        ),
        ArchitectureNode(
            id="postgres",
            name="PostgreSQL",
            type="storage",
            description="OLTP database storing raw ingested stock prices and pipeline metadata",
            tech="PostgreSQL 16",
            metrics={"schema": "pipeline"},
        ),
        ArchitectureNode(
            id="transform",
            name="Python Transform",
            type="process",
            description="Reads raw data from PG, computes technical indicators (SMA, EMA, MACD, RSI), writes to ClickHouse",
            tech="Python / pandas / numpy",
        ),
        ArchitectureNode(
            id="clickhouse",
            name="ClickHouse",
            type="storage",
            description="Columnar OLAP database optimised for analytical queries on time-series stock data",
            tech="ClickHouse 24 (ReplacingMergeTree)",
            metrics={"tables": 3},
        ),
        ArchitectureNode(
            id="fastapi",
            name="FastAPI",
            type="api",
            description="REST API serving pipeline health, metrics, stock data, and analytics endpoints",
            tech="FastAPI / Uvicorn",
        ),
        ArchitectureNode(
            id="nextjs",
            name="Next.js Dashboard",
            type="frontend",
            description="Interactive dashboard displaying stock charts, analytics, and pipeline status",
            tech="Next.js / React / Recharts",
        ),
    ]

    connections = [
        {"from": "alpha_vantage", "to": "ingestion", "label": "HTTP / JSON"},
        {"from": "ingestion", "to": "postgres", "label": "SQL INSERT (asyncpg)"},
        {"from": "postgres", "to": "transform", "label": "SQL SELECT (asyncpg)"},
        {"from": "transform", "to": "clickhouse", "label": "Native protocol (9000)"},
        {"from": "clickhouse", "to": "fastapi", "label": "Native protocol (9000)"},
        {"from": "postgres", "to": "fastapi", "label": "SQL (asyncpg)"},
        {"from": "fastapi", "to": "nextjs", "label": "REST API / JSON"},
    ]

    return ArchitectureResponse(nodes=nodes, connections=connections)
