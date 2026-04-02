"""Readers: parse each source format into ConvertedData."""

from __future__ import annotations

import csv
import io
import logging
import re
import sqlite3
from pathlib import Path

import pandas as pd

from .models import ColumnInfo, ConvertedData, TableData

logger = logging.getLogger(__name__)


def read_csv(file_path: Path) -> ConvertedData:
    """Read a CSV/TSV file into ConvertedData (single table)."""
    # Detect delimiter
    with open(file_path, "r", encoding="utf-8-sig", errors="replace") as f:
        sample = f.read(4096)
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t|")
        delimiter = dialect.delimiter
    except csv.Error:
        delimiter = ","

    df = pd.read_csv(file_path, delimiter=delimiter, dtype=str, keep_default_na=False)
    table_name = file_path.stem.replace(" ", "_").replace("-", "_")

    columns = [ColumnInfo(name=str(c), type="TEXT") for c in df.columns]
    rows = df.values.tolist()

    return ConvertedData(
        tables=[TableData(name=table_name, columns=columns, rows=rows)],
        source_format="csv",
    )


def read_excel(file_path: Path) -> ConvertedData:
    """Read an Excel file (XLS/XLSX) into ConvertedData (one table per sheet)."""
    ext = file_path.suffix.lower()
    engine = "xlrd" if ext == ".xls" else "openpyxl"

    xls = pd.ExcelFile(file_path, engine=engine)
    tables = []

    for sheet_name in xls.sheet_names:
        df = xls.parse(sheet_name, dtype=str, keep_default_na=False)
        if df.empty:
            continue
        safe_name = re.sub(r"[^a-zA-Z0-9_]", "_", sheet_name).strip("_")
        columns = [ColumnInfo(name=str(c), type="TEXT") for c in df.columns]
        rows = df.values.tolist()
        tables.append(TableData(name=safe_name, columns=columns, rows=rows))

    return ConvertedData(tables=tables, source_format="excel")


def read_sqlite(file_path: Path) -> ConvertedData:
    """Read a SQLite database file into ConvertedData."""
    conn = sqlite3.connect(str(file_path))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Get all user tables
    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    )
    table_names = [row[0] for row in cursor.fetchall()]

    tables = []
    warnings = []

    for tname in table_names:
        # Get column info
        cursor.execute(f"PRAGMA table_info(\"{tname}\")")
        col_info = cursor.fetchall()
        columns = [ColumnInfo(name=ci[1], type=ci[2] or "TEXT") for ci in col_info]

        # Get rows
        cursor.execute(f"SELECT * FROM \"{tname}\"")
        rows = [list(row) for row in cursor.fetchall()]

        # Get original DDL
        cursor.execute(f"SELECT sql FROM sqlite_master WHERE type='table' AND name=?", (tname,))
        ddl_row = cursor.fetchone()
        ddl = ddl_row[0] if ddl_row else None

        tables.append(TableData(name=tname, columns=columns, rows=rows, ddl=ddl))

    conn.close()
    return ConvertedData(tables=tables, source_format="sqlite", warnings=warnings)


def read_sql(file_path: Path) -> ConvertedData:
    """Read a SQL dump file, parse DDL and INSERT statements."""
    from .detect import detect_sql_dialect

    content = file_path.read_text(encoding="utf-8", errors="replace")
    dialect = detect_sql_dialect(content)

    tables: dict[str, TableData] = {}
    warnings = []

    # Parse CREATE TABLE statements
    create_pattern = re.compile(
        r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`\"\[]?(\w+)[`\"\]]?\s*\((.*?)\)\s*[;)]",
        re.IGNORECASE | re.DOTALL,
    )

    for match in create_pattern.finditer(content):
        tname = match.group(1)
        body = match.group(2)

        columns = []
        for line in body.split("\n"):
            line = line.strip().rstrip(",")
            if not line:
                continue
            # Skip constraints, indexes, keys
            upper = line.upper().lstrip()
            if any(upper.startswith(kw) for kw in (
                "PRIMARY", "KEY", "INDEX", "UNIQUE", "CONSTRAINT", "CHECK", "FOREIGN",
            )):
                continue

            # Parse column: name type [rest]
            col_match = re.match(r"[`\"\[]?(\w+)[`\"\]]?\s+(\w[\w(),.]*)", line)
            if col_match:
                columns.append(ColumnInfo(name=col_match.group(1), type=col_match.group(2)))

        tables[tname] = TableData(
            name=tname, columns=columns, rows=[], ddl=match.group(0)
        )

    # Parse INSERT statements
    insert_pattern = re.compile(
        r"INSERT\s+INTO\s+[`\"\[]?(\w+)[`\"\]]?\s*(?:\([^)]*\)\s*)?VALUES\s*(.*?);",
        re.IGNORECASE | re.DOTALL,
    )

    for match in insert_pattern.finditer(content):
        tname = match.group(1)
        values_str = match.group(2)

        if tname not in tables:
            tables[tname] = TableData(name=tname, columns=[], rows=[])

        # Parse value tuples
        tuple_pattern = re.compile(r"\(([^)]*)\)")
        for tmatch in tuple_pattern.finditer(values_str):
            raw = tmatch.group(1)
            # Simple CSV-like parsing of values
            values = _parse_sql_values(raw)
            tables[tname].rows.append(values)

    if not tables:
        warnings.append("No CREATE TABLE or INSERT statements found in SQL file.")

    return ConvertedData(
        tables=list(tables.values()),
        source_format=f"sql:{dialect}",
        warnings=warnings,
    )


def _parse_sql_values(raw: str) -> list:
    """Parse a comma-separated SQL values string into a list."""
    values = []
    current = ""
    in_string = False
    quote_char = None

    for ch in raw:
        if in_string:
            if ch == quote_char:
                in_string = False
            current += ch
        elif ch in ("'", '"'):
            in_string = True
            quote_char = ch
            current += ch
        elif ch == ",":
            values.append(_clean_sql_value(current.strip()))
            current = ""
        else:
            current += ch

    if current.strip():
        values.append(_clean_sql_value(current.strip()))

    return values


def _clean_sql_value(val: str) -> str | None:
    """Clean a single SQL value."""
    if val.upper() == "NULL":
        return None
    # Strip surrounding quotes
    if len(val) >= 2 and val[0] == val[-1] and val[0] in ("'", '"'):
        return val[1:-1].replace("\\'", "'").replace('\\"', '"')
    return val


def read_dbf(file_path: Path) -> ConvertedData:
    """Read a DBF (DBase/FoxPro) file into ConvertedData."""
    from dbfread import DBF

    dbf = DBF(str(file_path), encoding="utf-8", char_decode_errors="replace")

    columns = [ColumnInfo(name=f.name, type=f.type) for f in dbf.fields]
    rows = []
    for record in dbf:
        rows.append([record.get(f.name) for f in dbf.fields])

    table_name = file_path.stem.replace(" ", "_").replace("-", "_")

    return ConvertedData(
        tables=[TableData(name=table_name, columns=columns, rows=rows)],
        source_format="dbf",
    )


# Registry of readers
READERS = {
    "csv": read_csv,
    "excel": read_excel,
    "sqlite": read_sqlite,
    "sql": read_sql,
    "dbf": read_dbf,
}
