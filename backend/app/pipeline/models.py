"""SQLAlchemy models for the pipeline schema (PostgreSQL)."""

from datetime import date, datetime

from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    BigInteger,
    UniqueConstraint,
    func,
)

from app.core.database import Base


class RawStockPrice(Base):
    """Raw daily stock prices ingested from external sources."""

    __tablename__ = "raw_stock_prices"
    __table_args__ = (
        UniqueConstraint("symbol", "trade_date", name="uq_raw_stock_symbol_date"),
        {"schema": "pipeline"},
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    symbol = Column(String(10), nullable=False, index=True)
    trade_date = Column(Date, nullable=False, index=True)
    open = Column(Float, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(BigInteger, nullable=False)
    source = Column(String(50), nullable=True, default="alpha_vantage")
    ingested_at = Column(DateTime, nullable=False, server_default=func.now())


class PipelineRun(Base):
    """Audit log for every pipeline execution."""

    __tablename__ = "pipeline_runs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    run_type = Column(String(50), nullable=False)  # ingest | transform
    status = Column(String(20), nullable=False, default="pending")  # pending/running/completed/failed
    rows_processed = Column(Integer, nullable=True, default=0)
    rows_inserted = Column(Integer, nullable=True, default=0)
    started_at = Column(DateTime, nullable=False, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)


class PipelineMetric(Base):
    """Key-value store for pipeline operational metrics."""

    __tablename__ = "pipeline_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String(100), nullable=False, unique=True)
    value = Column(String(500), nullable=True)
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
