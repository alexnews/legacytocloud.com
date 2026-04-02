"""Common data model for converter pipeline."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class ColumnInfo:
    name: str
    type: str = "TEXT"  # original type string from source


@dataclass
class TableData:
    name: str
    columns: list[ColumnInfo] = field(default_factory=list)
    rows: list[list] = field(default_factory=list)
    ddl: str | None = None  # original DDL if available


@dataclass
class ConvertedData:
    tables: list[TableData] = field(default_factory=list)
    source_format: str = ""
    warnings: list[str] = field(default_factory=list)
