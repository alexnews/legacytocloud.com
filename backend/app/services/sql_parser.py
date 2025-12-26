"""SQL Parser - Parses CREATE TABLE statements from .sql files."""
import re
from typing import Optional


class SQLParser:
    """Parses SQL schema files and extracts table metadata."""

    # MySQL type patterns
    MYSQL_TYPE_PATTERN = re.compile(
        r'`?(\w+)`?\s+'  # Column name
        r'(\w+)'  # Base type
        r'(?:\s*\(\s*(\d+)(?:\s*,\s*(\d+))?\s*\))?'  # Optional (precision, scale)
        r'(\s+unsigned)?'  # Optional unsigned
        r'(?:\s+CHARACTER\s+SET\s+\w+)?'  # Optional charset
        r'(?:\s+COLLATE\s+\w+)?'  # Optional collation
        r'(\s+NOT\s+NULL|\s+NULL)?'  # Nullable
        r'(?:\s+DEFAULT\s+([^,\n]+?))?'  # Default value
        r'(\s+AUTO_INCREMENT)?'  # Auto increment
        r'(?:\s+COMMENT\s+\'([^\']*)\')?' # Comment
        r'(?:\s+PRIMARY\s+KEY)?'  # Inline primary key
        r'\s*(?:,|$|\))',
        re.IGNORECASE
    )

    @classmethod
    def parse_mysql(cls, sql_content: str) -> dict:
        """Parse MySQL CREATE TABLE statements from SQL content."""
        try:
            tables = []
            risks = []

            # Find all CREATE TABLE statements
            create_table_pattern = re.compile(
                r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?\s*\((.*?)\)\s*'
                r'(?:ENGINE\s*=\s*(\w+))?'
                r'(?:\s+DEFAULT\s+CHARSET\s*=\s*(\w+))?'
                r'(?:\s+COLLATE\s*=\s*(\w+))?'
                r'(?:\s+COMMENT\s*=\s*\'([^\']*)\')?\s*;',
                re.IGNORECASE | re.DOTALL
            )

            matches = create_table_pattern.findall(sql_content)

            for match in matches:
                table_name = match[0]
                table_body = match[1]
                engine = match[2] or 'InnoDB'
                charset = match[3] or 'utf8mb4'
                collation = match[4] or 'utf8mb4_general_ci'
                comment = match[5] or ''

                columns, primary_key_cols, indexes = cls._parse_table_body(table_body)

                has_primary_key = len(primary_key_cols) > 0

                # Mark primary key columns
                for col in columns:
                    if col['name'] in primary_key_cols:
                        col['key'] = 'PRI'

                table = {
                    "name": table_name,
                    "type": "BASE TABLE",
                    "engine": engine,
                    "row_count": 0,  # Unknown from schema file
                    "collation": collation,
                    "comment": comment,
                    "columns": columns,
                    "indexes": indexes,
                    "has_primary_key": has_primary_key
                }
                tables.append(table)

                # Detect risks
                if not has_primary_key:
                    risks.append({
                        "table": table_name,
                        "column": None,
                        "type": "no_primary_key",
                        "severity": "error",
                        "message": f"Table '{table_name}' has no primary key - required for incremental sync"
                    })

                # Check for risky column types
                risky_types = ['enum', 'set', 'bit', 'year', 'geometry', 'json', 'blob', 'longblob', 'mediumblob', 'tinyblob']
                for col in columns:
                    if col['data_type'].lower() in risky_types:
                        risks.append({
                            "table": table_name,
                            "column": col['name'],
                            "type": "risky_type",
                            "severity": "warning",
                            "message": f"Type '{col['data_type']}' may need special handling during migration"
                        })

            return {
                "success": True,
                "database": "uploaded_schema",
                "db_type": "mysql",
                "tables_count": len(tables),
                "total_rows": 0,
                "tables": tables,
                "risks": risks
            }

        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to parse SQL: {str(e)}",
                "tables_count": 0,
                "total_rows": 0,
                "tables": [],
                "risks": []
            }

    @classmethod
    def _parse_table_body(cls, body: str) -> tuple:
        """Parse the body of a CREATE TABLE statement."""
        columns = []
        primary_key_cols = []
        indexes = []

        # Split by lines and clean up
        lines = body.strip().split('\n')

        for line in lines:
            line = line.strip().rstrip(',')
            if not line:
                continue

            # Check for PRIMARY KEY constraint
            pk_match = re.match(r'PRIMARY\s+KEY\s*\(([^)]+)\)', line, re.IGNORECASE)
            if pk_match:
                pk_cols = pk_match.group(1)
                primary_key_cols = [c.strip().strip('`') for c in pk_cols.split(',')]
                continue

            # Check for KEY/INDEX
            idx_match = re.match(
                r'(?:UNIQUE\s+)?(?:KEY|INDEX)\s+`?(\w+)`?\s*\(([^)]+)\)',
                line, re.IGNORECASE
            )
            if idx_match:
                idx_name = idx_match.group(1)
                idx_cols = [c.strip().strip('`').split('(')[0] for c in idx_match.group(2).split(',')]
                is_unique = 'UNIQUE' in line.upper()
                indexes.append({
                    "name": idx_name,
                    "unique": is_unique,
                    "columns": idx_cols
                })
                continue

            # Check for UNIQUE constraint
            uniq_match = re.match(r'UNIQUE\s+KEY\s+`?(\w+)`?\s*\(([^)]+)\)', line, re.IGNORECASE)
            if uniq_match:
                idx_name = uniq_match.group(1)
                idx_cols = [c.strip().strip('`') for c in uniq_match.group(2).split(',')]
                indexes.append({
                    "name": idx_name,
                    "unique": True,
                    "columns": idx_cols
                })
                continue

            # Check for FOREIGN KEY - skip for now
            if re.match(r'(?:CONSTRAINT\s+)?FOREIGN\s+KEY', line, re.IGNORECASE):
                continue

            # Check for CONSTRAINT - skip
            if re.match(r'CONSTRAINT\s+', line, re.IGNORECASE):
                continue

            # Parse column definition
            col = cls._parse_column(line)
            if col:
                columns.append(col)
                # Check if this column is the primary key (inline)
                if 'PRIMARY KEY' in line.upper():
                    primary_key_cols.append(col['name'])

        return columns, primary_key_cols, indexes

    @classmethod
    def _parse_column(cls, line: str) -> Optional[dict]:
        """Parse a single column definition."""
        # Remove leading/trailing whitespace
        line = line.strip()

        # Skip if starts with KEY, INDEX, PRIMARY, UNIQUE, CONSTRAINT, FOREIGN
        skip_patterns = ['KEY', 'INDEX', 'PRIMARY', 'UNIQUE', 'CONSTRAINT', 'FOREIGN', 'CHECK', ')']
        for pattern in skip_patterns:
            if line.upper().startswith(pattern):
                return None

        # Extract column name (may be backtick-quoted)
        col_match = re.match(r'`?(\w+)`?\s+(.+)', line)
        if not col_match:
            return None

        col_name = col_match.group(1)
        rest = col_match.group(2)

        # Extract data type
        type_match = re.match(
            r'(\w+)(?:\s*\(\s*(\d+)(?:\s*,\s*(\d+))?\s*\))?',
            rest
        )
        if not type_match:
            return None

        data_type = type_match.group(1).lower()
        precision = type_match.group(2)
        scale = type_match.group(3)

        # Build full type string
        if precision and scale:
            full_type = f"{data_type}({precision},{scale})"
        elif precision:
            full_type = f"{data_type}({precision})"
        else:
            full_type = data_type

        # Check for UNSIGNED
        if 'UNSIGNED' in rest.upper():
            full_type += ' unsigned'

        # Check for NULL/NOT NULL
        nullable = 'NOT NULL' not in rest.upper()

        # Extract default value
        default = None
        default_match = re.search(r"DEFAULT\s+(?:'([^']*)'|(\w+))", rest, re.IGNORECASE)
        if default_match:
            default = default_match.group(1) or default_match.group(2)

        # Check for AUTO_INCREMENT
        extra = ''
        if 'AUTO_INCREMENT' in rest.upper():
            extra = 'auto_increment'

        # Extract comment
        comment = ''
        comment_match = re.search(r"COMMENT\s+'([^']*)'", rest, re.IGNORECASE)
        if comment_match:
            comment = comment_match.group(1)

        # Determine key type
        key = ''
        if 'PRIMARY KEY' in rest.upper():
            key = 'PRI'
        elif 'UNIQUE' in rest.upper():
            key = 'UNI'

        return {
            "name": col_name,
            "data_type": data_type,
            "full_type": full_type,
            "nullable": nullable,
            "default": default,
            "key": key,
            "extra": extra,
            "charset": None,
            "collation": None,
            "comment": comment
        }

    @classmethod
    def detect_dialect(cls, sql_content: str) -> str:
        """Detect SQL dialect from content."""
        content_upper = sql_content.upper()

        # MySQL indicators
        if 'ENGINE=' in content_upper or 'AUTO_INCREMENT' in content_upper:
            return 'mysql'

        # PostgreSQL indicators
        if 'SERIAL' in content_upper or 'RETURNING' in content_upper:
            return 'postgres'

        # MSSQL indicators
        if 'IDENTITY(' in content_upper or 'NVARCHAR' in content_upper:
            return 'mssql'

        # Default to MySQL
        return 'mysql'

    @classmethod
    def parse(cls, sql_content: str, dialect: Optional[str] = None) -> dict:
        """Parse SQL content, auto-detecting dialect if not specified."""
        if not dialect:
            dialect = cls.detect_dialect(sql_content)

        if dialect == 'mysql':
            return cls.parse_mysql(sql_content)
        else:
            # For now, try MySQL parser for other dialects
            # TODO: Add PostgreSQL and MSSQL parsers
            return cls.parse_mysql(sql_content)
