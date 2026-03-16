"""Transform pipeline: read raw data from PostgreSQL, compute indicators, write to ClickHouse."""

from __future__ import annotations

import logging
from datetime import datetime

import numpy as np
import pandas as pd
from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.pipeline.clickhouse import get_clickhouse_client
from app.pipeline.models import PipelineMetric, PipelineRun, RawStockPrice
from app.pipeline.seed_data import _compute_rsi

logger = logging.getLogger(__name__)


async def _fetch_raw_data(db: AsyncSession) -> pd.DataFrame:
    """Load all raw stock prices from PostgreSQL into a DataFrame."""
    result = await db.execute(
        select(
            RawStockPrice.symbol,
            RawStockPrice.trade_date,
            RawStockPrice.open,
            RawStockPrice.high,
            RawStockPrice.low,
            RawStockPrice.close,
            RawStockPrice.volume,
        ).order_by(RawStockPrice.symbol, RawStockPrice.trade_date)
    )
    rows = result.all()
    if not rows:
        return pd.DataFrame()

    df = pd.DataFrame(rows, columns=["symbol", "trade_date", "open", "high", "low", "close", "volume"])
    return df


def _transform_ohlcv(df: pd.DataFrame) -> pd.DataFrame:
    """Add daily_return and intraday_range columns."""
    frames = []
    for _, grp in df.groupby("symbol"):
        grp = grp.copy().sort_values("trade_date")
        grp["daily_return"] = grp["close"].pct_change().fillna(0.0)
        grp["intraday_range"] = ((grp["high"] - grp["low"]) / grp["open"]).fillna(0.0)
        frames.append(grp)
    return pd.concat(frames, ignore_index=True)


def _transform_moving_averages(df: pd.DataFrame) -> pd.DataFrame:
    """Compute SMA, EMA, MACD, and RSI per symbol."""
    frames = []
    for symbol, grp in df.groupby("symbol"):
        grp = grp.copy().sort_values("trade_date")
        grp["sma_20"] = grp["close"].rolling(window=20, min_periods=1).mean()
        grp["sma_50"] = grp["close"].rolling(window=50, min_periods=1).mean()
        grp["ema_12"] = grp["close"].ewm(span=12, adjust=False).mean()
        grp["ema_26"] = grp["close"].ewm(span=26, adjust=False).mean()
        grp["macd"] = grp["ema_12"] - grp["ema_26"]
        grp["macd_signal"] = grp["macd"].ewm(span=9, adjust=False).mean()
        grp["macd_histogram"] = grp["macd"] - grp["macd_signal"]
        grp["rsi_14"] = _compute_rsi(grp["close"], 14)
        frames.append(grp)
    return pd.concat(frames, ignore_index=True)


def _transform_volume(df: pd.DataFrame) -> pd.DataFrame:
    """Compute rolling average volume and volume ratio."""
    frames = []
    for _, grp in df.groupby("symbol"):
        grp = grp.copy().sort_values("trade_date")
        grp["avg_volume_20"] = grp["volume"].rolling(window=20, min_periods=1).mean()
        grp["volume_ratio"] = (grp["volume"] / grp["avg_volume_20"]).fillna(1.0)
        frames.append(grp)
    return pd.concat(frames, ignore_index=True)


def _insert_to_clickhouse(ohlcv_df: pd.DataFrame, ma_df: pd.DataFrame, vol_df: pd.DataFrame) -> int:
    """Batch insert all computed data into ClickHouse. Returns total rows inserted."""
    client = get_clickhouse_client()
    total = 0

    try:
        # OHLCV
        ohlcv_records = [
            (
                row.symbol, row.trade_date, row.open, row.high, row.low, row.close,
                int(row.volume), round(row.daily_return, 6), round(row.intraday_range, 6),
            )
            for row in ohlcv_df.itertuples(index=False)
        ]
        if ohlcv_records:
            client.execute(
                "INSERT INTO pipeline.stock_ohlcv "
                "(symbol, trade_date, open, high, low, close, volume, daily_return, intraday_range) VALUES",
                ohlcv_records,
            )
            total += len(ohlcv_records)

        # Moving averages
        ma_records = [
            (
                row.symbol, row.trade_date,
                round(row.sma_20, 4), round(row.sma_50, 4),
                round(row.ema_12, 4), round(row.ema_26, 4),
                round(row.macd, 4), round(row.macd_signal, 4), round(row.macd_histogram, 4),
                round(row.rsi_14, 4),
            )
            for row in ma_df.itertuples(index=False)
            if hasattr(row, "sma_20")
        ]
        if ma_records:
            client.execute(
                "INSERT INTO pipeline.stock_moving_averages "
                "(symbol, trade_date, sma_20, sma_50, ema_12, ema_26, macd, macd_signal, macd_histogram, rsi_14) VALUES",
                ma_records,
            )
            total += len(ma_records)

        # Volume analysis
        vol_records = [
            (
                row.symbol, row.trade_date, int(row.volume),
                round(row.avg_volume_20, 2), round(row.volume_ratio, 4),
            )
            for row in vol_df.itertuples(index=False)
            if hasattr(row, "avg_volume_20")
        ]
        if vol_records:
            client.execute(
                "INSERT INTO pipeline.stock_volume_analysis "
                "(symbol, trade_date, volume, avg_volume_20, volume_ratio) VALUES",
                vol_records,
            )
            total += len(vol_records)
    finally:
        client.disconnect()

    return total


async def _upsert_metric(db: AsyncSession, key: str, value: str) -> None:
    """Insert or update a pipeline metric row."""
    existing = await db.execute(
        select(PipelineMetric).where(PipelineMetric.key == key)
    )
    metric = existing.scalar_one_or_none()
    if metric:
        metric.value = value
        metric.updated_at = datetime.utcnow()
    else:
        db.add(PipelineMetric(key=key, value=value, updated_at=datetime.utcnow()))


async def run_transform(db: AsyncSession) -> PipelineRun:
    """Main transform entry point: PG -> compute -> ClickHouse."""
    run = PipelineRun(run_type="transform", status="running", started_at=datetime.utcnow())
    db.add(run)
    await db.commit()
    await db.refresh(run)

    try:
        # 1. Fetch raw data
        df = await _fetch_raw_data(db)
        if df.empty:
            run.status = "completed"
            run.rows_processed = 0
            run.rows_inserted = 0
            run.completed_at = datetime.utcnow()
            await db.commit()
            return run

        rows_processed = len(df)

        # 2. Compute transforms
        ohlcv_df = _transform_ohlcv(df)
        ma_df = _transform_moving_averages(df)
        vol_df = _transform_volume(df)

        # 3. Write to ClickHouse
        total_inserted = _insert_to_clickhouse(ohlcv_df, ma_df, vol_df)

        # 4. Update pipeline metrics
        await _upsert_metric(db, "last_sync", datetime.utcnow().isoformat())
        await _upsert_metric(db, "total_rows", str(total_inserted))
        symbols_count = df["symbol"].nunique()
        await _upsert_metric(db, "symbols_tracked", str(symbols_count))

        duration = (datetime.utcnow() - run.started_at).total_seconds()
        await _upsert_metric(db, "avg_transform_seconds", str(round(duration, 2)))

        run.status = "completed"
        run.rows_processed = rows_processed
        run.rows_inserted = total_inserted
        run.completed_at = datetime.utcnow()

    except Exception as exc:
        logger.exception("Transform failed: %s", exc)
        run.status = "failed"
        run.error_message = str(exc)[:500]
        run.completed_at = datetime.utcnow()

    await db.commit()
    await db.refresh(run)
    return run
