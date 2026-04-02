"""Detect input file format from extension and content."""

from __future__ import annotations

from pathlib import Path

# Map extensions to canonical format names
EXTENSION_MAP: dict[str, str] = {
    ".csv": "csv",
    ".tsv": "csv",
    ".xls": "excel",
    ".xlsx": "excel",
    ".sqlite": "sqlite",
    ".sqlite3": "sqlite",
    ".db": "sqlite",
    ".sql": "sql",
    ".dbf": "dbf",
}

SUPPORTED_SOURCES = {"csv", "excel", "sqlite", "sql", "dbf"}

SUPPORTED_TARGETS = {"csv", "xlsx", "mysql", "postgresql", "sqlite"}

# Aliases for target format (SEO-friendly names map to canonical)
TARGET_ALIASES: dict[str, str] = {
    "csv": "csv",
    "excel": "xlsx",
    "xlsx": "xlsx",
    "xls": "xlsx",
    "mysql": "mysql",
    "mariadb": "mysql",
    "postgresql": "postgresql",
    "postgres": "postgresql",
    "pgsql": "postgresql",
    "psql": "postgresql",
    "postgre": "postgresql",
    "sqlite": "sqlite",
    "sqlite3": "sqlite",
}

MAX_FREE_SIZE = 10 * 1024 * 1024  # 10 MB


def detect_format(filename: str) -> str | None:
    """Detect format from filename extension. Returns canonical format name or None."""
    ext = Path(filename).suffix.lower()
    return EXTENSION_MAP.get(ext)


def resolve_target(target: str) -> str | None:
    """Resolve a target format string (including aliases) to canonical name."""
    return TARGET_ALIASES.get(target.lower())


def detect_sql_dialect(content: str) -> str:
    """Guess SQL dialect from dump content."""
    upper = content[:5000].upper()

    if "AUTO_INCREMENT" in upper or "ENGINE=INNODB" in upper or "ENGINE=MYISAM" in upper:
        return "mysql"
    if "SERIAL" in upper or "BIGSERIAL" in upper or "SET search_path" in upper:
        return "postgresql"
    if "IDENTITY(" in upper or "NVARCHAR" in upper or "GO\n" in content[:5000]:
        return "tsql"
    if "AUTOINCREMENT" in upper and "SQLITE" not in upper:
        return "sqlite"

    # Default to mysql as most common dump format
    return "mysql"
