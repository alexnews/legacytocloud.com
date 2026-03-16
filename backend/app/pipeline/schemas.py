"""Pydantic response models for pipeline endpoints."""

from __future__ import annotations

from datetime import date, datetime
from typing import Any

from pydantic import BaseModel


# ---------------------------------------------------------------------------
# Stock price schemas
# ---------------------------------------------------------------------------

class StockPrice(BaseModel):
    symbol: str
    trade_date: date
    open: float
    high: float
    low: float
    close: float
    volume: int

    model_config = {"from_attributes": True}


class StockWithChange(BaseModel):
    symbol: str
    latest_price: float
    daily_change: float
    daily_change_pct: float
    volume: int


class StockOHLCV(StockPrice):
    daily_return: float
    intraday_range: float


# ---------------------------------------------------------------------------
# Analytics schemas
# ---------------------------------------------------------------------------

class MovingAverages(BaseModel):
    symbol: str
    trade_date: date
    sma_20: float
    sma_50: float
    ema_12: float
    ema_26: float
    macd: float
    macd_signal: float
    macd_histogram: float
    rsi_14: float


class VolumeAnalysis(BaseModel):
    symbol: str
    trade_date: date
    volume: int
    avg_volume_20: float
    volume_ratio: float


# ---------------------------------------------------------------------------
# Pipeline operational schemas
# ---------------------------------------------------------------------------

class PipelineHealth(BaseModel):
    status: str
    clickhouse_connected: bool
    postgres_connected: bool
    last_sync: datetime | None = None
    total_rows: int
    symbols_tracked: int


class PipelineMetrics(BaseModel):
    total_rows: int
    symbols: list[str]
    last_sync: str | None = None
    data_freshness_hours: float | None = None
    pipeline_runs_24h: int
    avg_transform_seconds: float | None = None


class PipelineRunResponse(BaseModel):
    id: int
    run_type: str
    status: str
    rows_processed: int | None
    rows_inserted: int | None
    started_at: datetime
    completed_at: datetime | None = None
    error_message: str | None = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Architecture visualisation schemas
# ---------------------------------------------------------------------------

class ArchitectureNode(BaseModel):
    id: str
    name: str
    type: str
    description: str
    tech: str
    metrics: dict[str, Any] | None = None


class ArchitectureResponse(BaseModel):
    nodes: list[ArchitectureNode]
    connections: list[dict[str, Any]]
