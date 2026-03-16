"""Add pipeline tables.

Revision ID: 003_pipeline
Revises: 4aaf57694b1d
Create Date: 2026-03-15
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "003_pipeline"
down_revision = "4aaf57694b1d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create pipeline schema
    op.execute("CREATE SCHEMA IF NOT EXISTS pipeline")

    # Raw stock prices (pipeline schema)
    op.create_table(
        "raw_stock_prices",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("symbol", sa.String(length=10), nullable=False),
        sa.Column("trade_date", sa.Date(), nullable=False),
        sa.Column("open", sa.Float(), nullable=False),
        sa.Column("high", sa.Float(), nullable=False),
        sa.Column("low", sa.Float(), nullable=False),
        sa.Column("close", sa.Float(), nullable=False),
        sa.Column("volume", sa.BigInteger(), nullable=False),
        sa.Column("source", sa.String(length=50), nullable=True),
        sa.Column(
            "ingested_at",
            sa.DateTime(),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("symbol", "trade_date", name="uq_raw_stock_symbol_date"),
        schema="pipeline",
    )
    op.create_index(
        "ix_raw_stock_prices_symbol",
        "raw_stock_prices",
        ["symbol"],
        schema="pipeline",
    )
    op.create_index(
        "ix_raw_stock_prices_trade_date",
        "raw_stock_prices",
        ["trade_date"],
        schema="pipeline",
    )

    # Pipeline runs (public schema)
    op.create_table(
        "pipeline_runs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("run_type", sa.String(length=50), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="pending"),
        sa.Column("rows_processed", sa.Integer(), nullable=True),
        sa.Column("rows_inserted", sa.Integer(), nullable=True),
        sa.Column(
            "started_at",
            sa.DateTime(),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

    # Pipeline metrics (public schema)
    op.create_table(
        "pipeline_metrics",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("key", sa.String(length=100), nullable=False, unique=True),
        sa.Column("value", sa.String(length=500), nullable=True),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("pipeline_metrics")
    op.drop_table("pipeline_runs")
    op.drop_index("ix_raw_stock_prices_trade_date", table_name="raw_stock_prices", schema="pipeline")
    op.drop_index("ix_raw_stock_prices_symbol", table_name="raw_stock_prices", schema="pipeline")
    op.drop_table("raw_stock_prices", schema="pipeline")
    op.execute("DROP SCHEMA IF EXISTS pipeline")
