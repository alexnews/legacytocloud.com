"""DDL Generator - Generates Snowflake CREATE TABLE statements from parsed schema."""
from typing import Optional


class SnowflakeDDLGenerator:
    """Generates Snowflake DDL from parsed schema data."""

    # MySQL to Snowflake type mappings
    TYPE_MAPPINGS = {
        # Integers
        'tinyint': 'SMALLINT',
        'smallint': 'SMALLINT',
        'mediumint': 'INTEGER',
        'int': 'INTEGER',
        'integer': 'INTEGER',
        'bigint': 'BIGINT',

        # Floating point
        'float': 'FLOAT',
        'double': 'DOUBLE',
        'real': 'DOUBLE',

        # Decimal/Numeric - handled specially to preserve precision
        'decimal': 'NUMBER',
        'numeric': 'NUMBER',

        # Strings
        'char': 'CHAR',
        'varchar': 'VARCHAR',
        'tinytext': 'VARCHAR(255)',
        'text': 'VARCHAR(16777216)',
        'mediumtext': 'VARCHAR(16777216)',
        'longtext': 'VARCHAR(16777216)',

        # Binary
        'binary': 'BINARY',
        'varbinary': 'BINARY',
        'tinyblob': 'BINARY',
        'blob': 'BINARY',
        'mediumblob': 'BINARY',
        'longblob': 'BINARY',

        # Date/Time
        'date': 'DATE',
        'time': 'TIME',
        'datetime': 'TIMESTAMP_NTZ',
        'timestamp': 'TIMESTAMP_NTZ',
        'year': 'SMALLINT',

        # Boolean
        'boolean': 'BOOLEAN',
        'bool': 'BOOLEAN',

        # JSON
        'json': 'VARIANT',

        # Special types
        'enum': 'VARCHAR(255)',
        'set': 'VARCHAR(1024)',
        'bit': 'BINARY',

        # Spatial (not fully supported in Snowflake)
        'geometry': 'VARIANT',
        'point': 'VARIANT',
        'linestring': 'VARIANT',
        'polygon': 'VARIANT',

        # UUID (MariaDB)
        'uuid': 'VARCHAR(36)',
    }

    @classmethod
    def map_type(cls, mysql_type: str, full_type: Optional[str] = None) -> str:
        """Map a MySQL type to Snowflake type."""
        base_type = mysql_type.lower().strip()

        # Handle decimal/numeric with precision
        if base_type in ('decimal', 'numeric'):
            if full_type:
                # Extract precision and scale from full_type like "decimal(10,2)"
                import re
                match = re.search(r'\((\d+)(?:,\s*(\d+))?\)', full_type)
                if match:
                    precision = match.group(1)
                    scale = match.group(2) or '0'
                    return f'NUMBER({precision},{scale})'
            return 'NUMBER(38,0)'

        # Handle varchar/char with length
        if base_type in ('varchar', 'char'):
            if full_type:
                import re
                match = re.search(r'\((\d+)\)', full_type)
                if match:
                    length = int(match.group(1))
                    # Snowflake max VARCHAR is 16777216
                    if length > 16777216:
                        length = 16777216
                    sf_type = 'CHAR' if base_type == 'char' else 'VARCHAR'
                    return f'{sf_type}({length})'
            return 'VARCHAR(255)'

        # Handle int types with display width (ignore display width)
        if base_type in ('tinyint', 'smallint', 'mediumint', 'int', 'integer', 'bigint'):
            # Check for tinyint(1) which is often boolean
            if base_type == 'tinyint' and full_type and '(1)' in full_type:
                return 'BOOLEAN'
            return cls.TYPE_MAPPINGS.get(base_type, 'VARCHAR')

        # Handle binary with length
        if base_type in ('binary', 'varbinary'):
            if full_type:
                import re
                match = re.search(r'\((\d+)\)', full_type)
                if match:
                    length = match.group(1)
                    return f'BINARY({length})'
            return 'BINARY'

        # Default mapping
        return cls.TYPE_MAPPINGS.get(base_type, 'VARCHAR')

    @classmethod
    def generate_column_ddl(cls, column: dict) -> str:
        """Generate DDL for a single column."""
        name = column['name']
        data_type = column.get('data_type', 'varchar')
        full_type = column.get('full_type', data_type)

        # Map to Snowflake type
        sf_type = cls.map_type(data_type, full_type)

        # Build column definition
        parts = [f'    "{name.upper()}"', sf_type]

        # NOT NULL constraint
        if not column.get('nullable', True):
            parts.append('NOT NULL')

        # Default value
        default = column.get('default')
        if default is not None:
            # Handle special defaults
            if default.upper() in ('CURRENT_TIMESTAMP', 'NOW()'):
                parts.append('DEFAULT CURRENT_TIMESTAMP()')
            elif default.upper() == 'NULL':
                parts.append('DEFAULT NULL')
            elif sf_type in ('INTEGER', 'BIGINT', 'SMALLINT', 'NUMBER', 'FLOAT', 'DOUBLE'):
                # Numeric default
                parts.append(f'DEFAULT {default}')
            elif sf_type == 'BOOLEAN':
                # Boolean default
                if default in ('1', 'true', 'TRUE'):
                    parts.append('DEFAULT TRUE')
                elif default in ('0', 'false', 'FALSE'):
                    parts.append('DEFAULT FALSE')
            else:
                # String default
                parts.append(f"DEFAULT '{default}'")

        # Comment
        comment = column.get('comment')
        if comment:
            parts.append(f"COMMENT '{comment}'")

        return ' '.join(parts)

    @classmethod
    def generate_table_ddl(cls, table: dict, schema: str = 'PUBLIC') -> str:
        """Generate Snowflake CREATE TABLE statement for a table."""
        table_name = table['name'].upper()
        columns = table.get('columns', [])

        if not columns:
            return f'-- Table {table_name} has no columns\n'

        # Generate column definitions
        column_ddls = [cls.generate_column_ddl(col) for col in columns]

        # Add primary key constraint if exists
        pk_columns = []
        for col in columns:
            if col.get('key') == 'PRI':
                pk_columns.append(col['name'].upper())

        if pk_columns:
            pk_cols_str = '", "'.join(pk_columns)
            pk_ddl = f'    PRIMARY KEY ("{pk_cols_str}")'
            column_ddls.append(pk_ddl)

        # Build CREATE TABLE statement
        ddl = f'CREATE TABLE IF NOT EXISTS {schema}."{table_name}" (\n'
        ddl += ',\n'.join(column_ddls)
        ddl += '\n)'

        # Add table comment
        comment = table.get('comment')
        if comment:
            ddl += f"\nCOMMENT = '{comment}'"

        ddl += ';\n'

        return ddl

    @classmethod
    def generate_ddl(cls, analysis_result: dict, schema: str = 'PUBLIC', database: str = 'MY_DATABASE') -> str:
        """Generate complete Snowflake DDL from analysis result."""
        tables = analysis_result.get('tables', [])

        if not tables:
            return '-- No tables found in schema\n'

        # Header
        ddl_parts = [
            f'-- Snowflake DDL generated from {analysis_result.get("db_type", "MySQL")} schema',
            f'-- Source database: {analysis_result.get("database", "unknown")}',
            f'-- Tables: {len(tables)}',
            '',
            f'-- Create schema if not exists',
            f'CREATE SCHEMA IF NOT EXISTS {database}.{schema};',
            f'USE SCHEMA {database}.{schema};',
            '',
            '-- =============================================',
            '-- TABLE DEFINITIONS',
            '-- =============================================',
            '',
        ]

        # Generate DDL for each table
        for table in tables:
            table_name = table['name']
            row_count = table.get('row_count', 0)
            col_count = len(table.get('columns', []))

            ddl_parts.append(f'-- Table: {table_name} ({col_count} columns, ~{row_count:,} rows)')
            ddl_parts.append(cls.generate_table_ddl(table, schema))
            ddl_parts.append('')

        # Add indexes as comments (Snowflake handles clustering differently)
        ddl_parts.append('-- =============================================')
        ddl_parts.append('-- CLUSTERING RECOMMENDATIONS')
        ddl_parts.append('-- =============================================')
        ddl_parts.append('-- Snowflake uses clustering keys instead of indexes.')
        ddl_parts.append('-- Consider adding clustering keys for frequently filtered columns:')
        ddl_parts.append('')

        for table in tables:
            indexes = table.get('indexes', [])
            if indexes:
                table_name = table['name'].upper()
                for idx in indexes:
                    if idx.get('columns'):
                        cols = ', '.join([f'"{c.upper()}"' for c in idx['columns']])
                        ddl_parts.append(f'-- ALTER TABLE {schema}."{table_name}" CLUSTER BY ({cols});')

        ddl_parts.append('')
        ddl_parts.append('-- End of DDL')

        return '\n'.join(ddl_parts)
