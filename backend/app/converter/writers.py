"""Writers: convert ConvertedData to each target format."""

from __future__ import annotations

import csv
import io
import logging
import sqlite3
import tempfile
from pathlib import Path

import pandas as pd

from .models import ConvertedData, TableData

logger = logging.getLogger(__name__)


def _table_to_dataframe(table: TableData) -> pd.DataFrame:
    """Convert a TableData to a pandas DataFrame."""
    col_names = [c.name for c in table.columns] if table.columns else None
    if col_names and table.rows:
        # Ensure row length matches column count
        rows = [r[:len(col_names)] for r in table.rows]
        return pd.DataFrame(rows, columns=col_names)
    elif table.rows:
        return pd.DataFrame(table.rows)
    elif col_names:
        return pd.DataFrame(columns=col_names)
    return pd.DataFrame()


def write_csv(data: ConvertedData, output_dir: Path) -> list[Path]:
    """Write each table as a separate CSV file."""
    files = []
    for table in data.tables:
        df = _table_to_dataframe(table)
        fpath = output_dir / f"{table.name}.csv"
        df.to_csv(fpath, index=False, quoting=csv.QUOTE_NONNUMERIC)
        files.append(fpath)
    return files


def write_xlsx(data: ConvertedData, output_dir: Path) -> list[Path]:
    """Write each table as a separate XLSX file."""
    files = []
    for table in data.tables:
        df = _table_to_dataframe(table)
        fpath = output_dir / f"{table.name}.xlsx"
        df.to_excel(fpath, index=False, engine="openpyxl")
        files.append(fpath)
    return files


def _map_type_to_mysql(col_type: str) -> str:
    """Map a generic/source column type to MySQL type."""
    t = col_type.upper().strip()
    mapping = {
        "INTEGER": "INT",
        "BIGINT": "BIGINT",
        "SMALLINT": "SMALLINT",
        "TINYINT": "TINYINT",
        "REAL": "DOUBLE",
        "FLOAT": "FLOAT",
        "DOUBLE": "DOUBLE",
        "NUMERIC": "DECIMAL(18,6)",
        "DECIMAL": "DECIMAL(18,6)",
        "BOOLEAN": "TINYINT(1)",
        "BOOL": "TINYINT(1)",
        "DATE": "DATE",
        "DATETIME": "DATETIME",
        "TIMESTAMP": "DATETIME",
        "BLOB": "LONGBLOB",
        "CLOB": "LONGTEXT",
    }
    for key, val in mapping.items():
        if t.startswith(key):
            return val
    if "CHAR" in t or "TEXT" in t:
        return "TEXT"
    return "TEXT"


def _map_type_to_pg(col_type: str) -> str:
    """Map a generic/source column type to PostgreSQL type."""
    t = col_type.upper().strip()
    mapping = {
        "INTEGER": "INTEGER",
        "INT": "INTEGER",
        "BIGINT": "BIGINT",
        "SMALLINT": "SMALLINT",
        "TINYINT": "SMALLINT",
        "REAL": "DOUBLE PRECISION",
        "FLOAT": "DOUBLE PRECISION",
        "DOUBLE": "DOUBLE PRECISION",
        "NUMERIC": "NUMERIC(18,6)",
        "DECIMAL": "NUMERIC(18,6)",
        "BOOLEAN": "BOOLEAN",
        "BOOL": "BOOLEAN",
        "DATE": "DATE",
        "DATETIME": "TIMESTAMP",
        "TIMESTAMP": "TIMESTAMP",
        "BLOB": "BYTEA",
        "LONGBLOB": "BYTEA",
        "CLOB": "TEXT",
        "LONGTEXT": "TEXT",
        "AUTO_INCREMENT": "SERIAL",
    }
    for key, val in mapping.items():
        if t.startswith(key):
            return val
    if "CHAR" in t or "TEXT" in t:
        return "TEXT"
    return "TEXT"


def _escape_sql_value(val) -> str:
    """Escape a value for SQL INSERT."""
    if val is None:
        return "NULL"
    s = str(val)
    return "'" + s.replace("\\", "\\\\").replace("'", "''") + "'"


def _quote_id_mysql(name: str) -> str:
    return f"`{name}`"


def _quote_id_pg(name: str) -> str:
    return f'"{name}"'


def write_mysql(data: ConvertedData, output_dir: Path) -> list[Path]:
    """Write all tables as a single MySQL dump file."""
    lines = ["-- Converted by LegacyToCloud.com", "SET NAMES utf8mb4;", ""]

    for table in data.tables:
        tname = _quote_id_mysql(table.name)

        # CREATE TABLE
        col_defs = []
        for col in table.columns:
            mysql_type = _map_type_to_mysql(col.type)
            col_defs.append(f"  {_quote_id_mysql(col.name)} {mysql_type}")
        if col_defs:
            lines.append(f"CREATE TABLE IF NOT EXISTS {tname} (")
            lines.append(",\n".join(col_defs))
            lines.append(");")
            lines.append("")

        # INSERT statements (batched by 100 rows)
        if table.rows:
            for i in range(0, len(table.rows), 100):
                batch = table.rows[i : i + 100]
                col_list = ", ".join(_quote_id_mysql(c.name) for c in table.columns) if table.columns else ""
                lines.append(f"INSERT INTO {tname} ({col_list}) VALUES")
                value_lines = []
                for row in batch:
                    vals = ", ".join(_escape_sql_value(v) for v in row)
                    value_lines.append(f"({vals})")
                lines.append(",\n".join(value_lines) + ";")
                lines.append("")

    fpath = output_dir / "dump.sql"
    fpath.write_text("\n".join(lines), encoding="utf-8")
    return [fpath]


def write_postgresql(data: ConvertedData, output_dir: Path) -> list[Path]:
    """Write all tables as a single PostgreSQL dump file."""
    lines = ["-- Converted by LegacyToCloud.com", "SET client_encoding = 'UTF8';", ""]

    for table in data.tables:
        tname = _quote_id_pg(table.name)

        # CREATE TABLE
        col_defs = []
        for col in table.columns:
            pg_type = _map_type_to_pg(col.type)
            col_defs.append(f"  {_quote_id_pg(col.name)} {pg_type}")
        if col_defs:
            lines.append(f"CREATE TABLE IF NOT EXISTS {tname} (")
            lines.append(",\n".join(col_defs))
            lines.append(");")
            lines.append("")

        # INSERT statements (batched by 100 rows)
        if table.rows:
            for i in range(0, len(table.rows), 100):
                batch = table.rows[i : i + 100]
                col_list = ", ".join(_quote_id_pg(c.name) for c in table.columns) if table.columns else ""
                lines.append(f"INSERT INTO {tname} ({col_list}) VALUES")
                value_lines = []
                for row in batch:
                    vals = ", ".join(_escape_sql_value(v) for v in row)
                    value_lines.append(f"({vals})")
                lines.append(",\n".join(value_lines) + ";")
                lines.append("")

    fpath = output_dir / "dump.sql"
    fpath.write_text("\n".join(lines), encoding="utf-8")
    return [fpath]


def write_sqlite(data: ConvertedData, output_dir: Path) -> list[Path]:
    """Write all tables into a single SQLite database file."""
    fpath = output_dir / "database.sqlite"
    conn = sqlite3.connect(str(fpath))
    cursor = conn.cursor()

    for table in data.tables:
        # Create table
        if table.columns:
            col_defs = ", ".join(f'"{c.name}" TEXT' for c in table.columns)
            cursor.execute(f'CREATE TABLE IF NOT EXISTS "{table.name}" ({col_defs})')
        elif table.rows and table.rows[0]:
            # No column info, generate generic names
            col_defs = ", ".join(f'"col_{i}" TEXT' for i in range(len(table.rows[0])))
            cursor.execute(f'CREATE TABLE IF NOT EXISTS "{table.name}" ({col_defs})')

        # Insert rows
        if table.rows:
            ncols = len(table.columns) if table.columns else len(table.rows[0])
            placeholders = ", ".join(["?"] * ncols)
            for row in table.rows:
                # Pad or truncate row to match column count
                padded = list(row[:ncols]) + [None] * max(0, ncols - len(row))
                # Convert all values to strings (SQLite is flexible but keep it safe)
                safe = [str(v) if v is not None else None for v in padded]
                cursor.execute(f'INSERT INTO "{table.name}" VALUES ({placeholders})', safe)

    conn.commit()
    conn.close()
    return [fpath]


# Registry of writers
WRITERS = {
    "csv": write_csv,
    "xlsx": write_xlsx,
    "mysql": write_mysql,
    "postgresql": write_postgresql,
    "sqlite": write_sqlite,
}
