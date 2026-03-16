"""ClickHouse connection helper using clickhouse-driver."""

import logging
from pathlib import Path

from clickhouse_driver import Client

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def get_clickhouse_client() -> Client:
    """Return a ClickHouse Client instance configured from application settings."""
    settings = get_settings()
    return Client(
        host=settings.clickhouse_host,
        port=settings.clickhouse_port,
        database=settings.clickhouse_database,
    )


def execute_clickhouse(query: str, params: dict | None = None) -> list:
    """Execute a single query against ClickHouse and return the result rows."""
    client = get_clickhouse_client()
    try:
        if params:
            return client.execute(query, params)
        return client.execute(query)
    finally:
        client.disconnect()


def init_clickhouse() -> None:
    """Read clickhouse_init.sql and execute each statement to bootstrap the schema."""
    sql_path = Path(__file__).parent / "clickhouse_init.sql"
    if not sql_path.exists():
        logger.warning("clickhouse_init.sql not found at %s", sql_path)
        return

    sql_text = sql_path.read_text()
    settings = get_settings()
    client = Client(
        host=settings.clickhouse_host,
        port=settings.clickhouse_port,
    )

    try:
        for statement in sql_text.split(";"):
            statement = statement.strip()
            if statement:
                logger.info("Executing ClickHouse DDL: %s...", statement[:80])
                client.execute(statement)
        logger.info("ClickHouse schema initialised successfully.")
    finally:
        client.disconnect()
