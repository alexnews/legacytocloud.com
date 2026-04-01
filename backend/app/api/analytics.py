"""API endpoints serving data from dbt marts tables."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

router = APIRouter()


@router.get("/analytics/articles-by-source")
async def articles_by_source(db: AsyncSession = Depends(get_db)):
    """Article counts and quality metrics per news source."""
    result = await db.execute(
        text("SELECT * FROM pipeline_marts.fct_articles_by_source ORDER BY total_articles DESC")
    )
    return [dict(r._mapping) for r in result.all()]


@router.get("/analytics/weekly-summary")
async def weekly_summary(db: AsyncSession = Depends(get_db)):
    """Weekly article volume and quality."""
    result = await db.execute(
        text("SELECT * FROM pipeline_marts.fct_weekly_news_summary ORDER BY week_start DESC LIMIT 20")
    )
    return [dict(r._mapping) for r in result.all()]


@router.get("/analytics/stock-symbols")
async def stock_symbols(db: AsyncSession = Depends(get_db)):
    """Summary stats per stock symbol."""
    result = await db.execute(
        text("SELECT * FROM pipeline_marts.dim_stock_symbols ORDER BY symbol")
    )
    return [dict(r._mapping) for r in result.all()]


@router.get("/analytics/stock-returns")
async def stock_returns(
    symbol: str = Query(default="AAPL"),
    limit: int = Query(default=30, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Daily returns and moving averages for a symbol."""
    result = await db.execute(
        text("""
            SELECT * FROM pipeline_marts.fct_daily_stock_returns
            WHERE symbol = :symbol
            ORDER BY trade_date DESC
            LIMIT :limit
        """),
        {"symbol": symbol, "limit": limit},
    )
    return [dict(r._mapping) for r in result.all()]
