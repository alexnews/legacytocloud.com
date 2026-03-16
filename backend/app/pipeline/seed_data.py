"""Generate and seed realistic synthetic OHLCV data for the pipeline."""

from __future__ import annotations

import logging
import math
import random
from datetime import date, datetime, timedelta

import numpy as np
import pandas as pd
from sqlalchemy import select, func
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.pipeline.clickhouse import get_clickhouse_client
from app.pipeline.models import RawStockPrice

logger = logging.getLogger(__name__)

# Realistic starting prices
SEED_SYMBOLS: dict[str, float] = {
    "AAPL": 175.0,
    "MSFT": 375.0,
    "JPM": 195.0,
    "GS": 385.0,
}

DAILY_DRIFT = 0.0005  # +0.05 % daily drift
DAILY_VOL = 0.015  # ~1.5 % daily volatility


def generate_seed_data(
    symbols: dict[str, float] | None = None,
    days: int = 365,
) -> list[dict]:
    """Return a list of dicts with one year of synthetic daily OHLCV rows."""
    symbols = symbols or SEED_SYMBOLS
    random.seed(42)
    np.random.seed(42)

    end_date = date.today()
    start_date = end_date - timedelta(days=days)

    rows: list[dict] = []

    for symbol, start_price in symbols.items():
        price = start_price
        current = start_date

        while current <= end_date:
            # Skip weekends
            if current.weekday() >= 5:
                current += timedelta(days=1)
                continue

            # Random walk with drift
            daily_ret = np.random.normal(DAILY_DRIFT, DAILY_VOL)
            price = price * math.exp(daily_ret)

            # Intraday high / low around the close
            intra_range = abs(np.random.normal(0, DAILY_VOL)) * price
            high = price + intra_range * random.uniform(0.3, 0.7)
            low = price - intra_range * random.uniform(0.3, 0.7)
            open_price = low + (high - low) * random.uniform(0.2, 0.8)

            # Volume loosely tied to volatility
            base_volume = random.randint(20_000_000, 80_000_000)
            volume = int(base_volume * (1 + abs(daily_ret) * 20))

            rows.append(
                {
                    "symbol": symbol,
                    "trade_date": current,
                    "open": round(open_price, 2),
                    "high": round(high, 2),
                    "low": round(low, 2),
                    "close": round(price, 2),
                    "volume": volume,
                }
            )

            current += timedelta(days=1)

    return rows


# ------------------------------------------------------------------
# Postgres seeding
# ------------------------------------------------------------------

async def seed_postgres(db: AsyncSession) -> None:
    """Insert synthetic seed data into PostgreSQL if the table is empty."""
    count = await db.scalar(select(func.count()).select_from(RawStockPrice))
    if count and count > 0:
        logger.info("PostgreSQL already has %d rows -- skipping seed.", count)
        return

    logger.info("Seeding PostgreSQL with synthetic stock data...")
    rows = generate_seed_data()

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
                source="seed",
            )
            .on_conflict_do_nothing(constraint="uq_raw_stock_symbol_date")
        )
        await db.execute(stmt)

    await db.commit()
    logger.info("Seeded %d rows into PostgreSQL.", len(rows))


# ------------------------------------------------------------------
# ClickHouse seeding
# ------------------------------------------------------------------

def _compute_rsi(series: pd.Series, period: int = 14) -> pd.Series:
    """Compute RSI-14 using the standard smoothed method."""
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.rolling(window=period, min_periods=period).mean()
    avg_loss = loss.rolling(window=period, min_periods=period).mean()
    # Subsequent values use exponential smoothing
    for i in range(period, len(avg_gain)):
        avg_gain.iloc[i] = (avg_gain.iloc[i - 1] * (period - 1) + gain.iloc[i]) / period
        avg_loss.iloc[i] = (avg_loss.iloc[i - 1] * (period - 1) + loss.iloc[i]) / period
    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50.0)


def seed_clickhouse() -> None:
    """Transform seed data and insert into all three ClickHouse tables."""
    logger.info("Seeding ClickHouse with computed analytics data...")

    rows = generate_seed_data()
    df = pd.DataFrame(rows)
    df = df.sort_values(["symbol", "trade_date"]).reset_index(drop=True)

    client = get_clickhouse_client()

    try:
        # ---------------------------------------------------------------
        # 1. stock_ohlcv
        # ---------------------------------------------------------------
        ohlcv_frames = []
        for symbol, grp in df.groupby("symbol"):
            grp = grp.copy().sort_values("trade_date")
            grp["daily_return"] = grp["close"].pct_change().fillna(0.0)
            grp["intraday_range"] = ((grp["high"] - grp["low"]) / grp["open"]).fillna(0.0)
            ohlcv_frames.append(grp)

        ohlcv_df = pd.concat(ohlcv_frames, ignore_index=True)
        ohlcv_records = [
            (
                row.symbol,
                row.trade_date,
                row.open,
                row.high,
                row.low,
                row.close,
                int(row.volume),
                round(row.daily_return, 6),
                round(row.intraday_range, 6),
            )
            for row in ohlcv_df.itertuples(index=False)
        ]
        client.execute(
            "INSERT INTO pipeline.stock_ohlcv "
            "(symbol, trade_date, open, high, low, close, volume, daily_return, intraday_range) VALUES",
            ohlcv_records,
        )
        logger.info("Inserted %d rows into stock_ohlcv.", len(ohlcv_records))

        # ---------------------------------------------------------------
        # 2. stock_moving_averages
        # ---------------------------------------------------------------
        ma_frames = []
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
            ma_frames.append(grp)

        ma_df = pd.concat(ma_frames, ignore_index=True)
        ma_records = [
            (
                row.symbol,
                row.trade_date,
                round(row.sma_20, 4),
                round(row.sma_50, 4),
                round(row.ema_12, 4),
                round(row.ema_26, 4),
                round(row.macd, 4),
                round(row.macd_signal, 4),
                round(row.macd_histogram, 4),
                round(row.rsi_14, 4),
            )
            for row in ma_df.itertuples(index=False)
        ]
        client.execute(
            "INSERT INTO pipeline.stock_moving_averages "
            "(symbol, trade_date, sma_20, sma_50, ema_12, ema_26, macd, macd_signal, macd_histogram, rsi_14) VALUES",
            ma_records,
        )
        logger.info("Inserted %d rows into stock_moving_averages.", len(ma_records))

        # ---------------------------------------------------------------
        # 3. stock_volume_analysis
        # ---------------------------------------------------------------
        vol_frames = []
        for symbol, grp in df.groupby("symbol"):
            grp = grp.copy().sort_values("trade_date")
            grp["avg_volume_20"] = grp["volume"].rolling(window=20, min_periods=1).mean()
            grp["volume_ratio"] = (grp["volume"] / grp["avg_volume_20"]).fillna(1.0)
            vol_frames.append(grp)

        vol_df = pd.concat(vol_frames, ignore_index=True)
        vol_records = [
            (
                row.symbol,
                row.trade_date,
                int(row.volume),
                round(row.avg_volume_20, 2),
                round(row.volume_ratio, 4),
            )
            for row in vol_df.itertuples(index=False)
        ]
        client.execute(
            "INSERT INTO pipeline.stock_volume_analysis "
            "(symbol, trade_date, volume, avg_volume_20, volume_ratio) VALUES",
            vol_records,
        )
        logger.info("Inserted %d rows into stock_volume_analysis.", len(vol_records))
    finally:
        client.disconnect()

    logger.info("ClickHouse seeding complete.")
