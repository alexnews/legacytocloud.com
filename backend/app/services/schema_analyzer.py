"""Schema analyzer service - extracts schema metadata from databases."""
import pymysql
import psycopg2
import pymssql
from typing import Optional
from app.models.connection import DatabaseType


class SchemaAnalyzer:
    """Analyzes database schemas and extracts metadata."""

    @staticmethod
    def analyze_mysql(
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
        ssl: bool = False
    ) -> dict:
        """Analyze MySQL database schema."""
        try:
            ssl_config = {"ssl": {"ssl_mode": "require"}} if ssl else {}
            conn = pymysql.connect(
                host=host,
                port=port,
                user=username,
                password=password,
                database=database,
                connect_timeout=30,
                **ssl_config
            )
            cursor = conn.cursor(pymysql.cursors.DictCursor)

            # Get all tables
            cursor.execute("""
                SELECT
                    TABLE_NAME,
                    TABLE_TYPE,
                    ENGINE,
                    TABLE_ROWS,
                    TABLE_COLLATION,
                    TABLE_COMMENT
                FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = %s
                ORDER BY TABLE_NAME
            """, (database,))
            tables_raw = cursor.fetchall()

            tables = []
            risks = []
            total_rows = 0

            for table_info in tables_raw:
                table_name = table_info['TABLE_NAME']
                row_count = table_info['TABLE_ROWS'] or 0
                total_rows += row_count

                # Get columns for this table
                cursor.execute("""
                    SELECT
                        COLUMN_NAME,
                        DATA_TYPE,
                        COLUMN_TYPE,
                        IS_NULLABLE,
                        COLUMN_DEFAULT,
                        COLUMN_KEY,
                        EXTRA,
                        CHARACTER_SET_NAME,
                        COLLATION_NAME,
                        COLUMN_COMMENT
                    FROM information_schema.COLUMNS
                    WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s
                    ORDER BY ORDINAL_POSITION
                """, (database, table_name))
                columns_raw = cursor.fetchall()

                columns = []
                has_primary_key = False

                for col in columns_raw:
                    column = {
                        "name": col['COLUMN_NAME'],
                        "data_type": col['DATA_TYPE'],
                        "full_type": col['COLUMN_TYPE'],
                        "nullable": col['IS_NULLABLE'] == 'YES',
                        "default": col['COLUMN_DEFAULT'],
                        "key": col['COLUMN_KEY'],
                        "extra": col['EXTRA'],
                        "charset": col['CHARACTER_SET_NAME'],
                        "collation": col['COLLATION_NAME'],
                        "comment": col['COLUMN_COMMENT']
                    }
                    columns.append(column)

                    if col['COLUMN_KEY'] == 'PRI':
                        has_primary_key = True

                    # Detect risky types
                    risky_types = ['enum', 'set', 'bit', 'year', 'geometry', 'json']
                    if col['DATA_TYPE'].lower() in risky_types:
                        risks.append({
                            "table": table_name,
                            "column": col['COLUMN_NAME'],
                            "type": "risky_type",
                            "severity": "warning",
                            "message": f"Type '{col['DATA_TYPE']}' may need special handling during migration"
                        })

                    # Detect mixed encodings
                    if col['COLLATION_NAME'] and 'latin' in col['COLLATION_NAME'].lower():
                        risks.append({
                            "table": table_name,
                            "column": col['COLUMN_NAME'],
                            "type": "encoding",
                            "severity": "warning",
                            "message": f"Non-UTF8 collation '{col['COLLATION_NAME']}' detected"
                        })

                # Get indexes
                cursor.execute("""
                    SELECT
                        INDEX_NAME,
                        NON_UNIQUE,
                        COLUMN_NAME,
                        SEQ_IN_INDEX
                    FROM information_schema.STATISTICS
                    WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s
                    ORDER BY INDEX_NAME, SEQ_IN_INDEX
                """, (database, table_name))
                indexes_raw = cursor.fetchall()

                # Group by index name
                indexes = {}
                for idx in indexes_raw:
                    idx_name = idx['INDEX_NAME']
                    if idx_name not in indexes:
                        indexes[idx_name] = {
                            "name": idx_name,
                            "unique": idx['NON_UNIQUE'] == 0,
                            "columns": []
                        }
                    indexes[idx_name]['columns'].append(idx['COLUMN_NAME'])

                table = {
                    "name": table_name,
                    "type": table_info['TABLE_TYPE'],
                    "engine": table_info['ENGINE'],
                    "row_count": row_count,
                    "collation": table_info['TABLE_COLLATION'],
                    "comment": table_info['TABLE_COMMENT'],
                    "columns": columns,
                    "indexes": list(indexes.values()),
                    "has_primary_key": has_primary_key
                }
                tables.append(table)

                # Risk: no primary key
                if not has_primary_key:
                    risks.append({
                        "table": table_name,
                        "column": None,
                        "type": "no_primary_key",
                        "severity": "error",
                        "message": f"Table '{table_name}' has no primary key - required for incremental sync"
                    })

                # Risk: very large table
                if row_count and row_count > 1000000:
                    risks.append({
                        "table": table_name,
                        "column": None,
                        "type": "large_table",
                        "severity": "info",
                        "message": f"Table '{table_name}' has {row_count:,} rows - consider chunked migration"
                    })

            cursor.close()
            conn.close()

            return {
                "success": True,
                "database": database,
                "db_type": "mysql",
                "tables_count": len(tables),
                "total_rows": total_rows,
                "tables": tables,
                "risks": risks
            }

        except pymysql.Error as e:
            return {
                "success": False,
                "error": f"MySQL error: {str(e)}",
                "tables_count": 0,
                "total_rows": 0,
                "tables": [],
                "risks": []
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Analysis failed: {str(e)}",
                "tables_count": 0,
                "total_rows": 0,
                "tables": [],
                "risks": []
            }

    @staticmethod
    def analyze_postgres(
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
        ssl: bool = False,
        schema: str = "public"
    ) -> dict:
        """Analyze PostgreSQL database schema."""
        try:
            sslmode = "require" if ssl else "prefer"
            conn = psycopg2.connect(
                host=host,
                port=port,
                user=username,
                password=password,
                dbname=database,
                sslmode=sslmode,
                connect_timeout=30
            )
            cursor = conn.cursor()

            # Get all tables
            cursor.execute("""
                SELECT
                    t.table_name,
                    t.table_type,
                    pg_catalog.obj_description(c.oid, 'pg_class') as comment,
                    (SELECT reltuples::bigint FROM pg_class WHERE relname = t.table_name) as row_estimate
                FROM information_schema.tables t
                LEFT JOIN pg_class c ON c.relname = t.table_name
                WHERE t.table_schema = %s
                  AND t.table_type IN ('BASE TABLE', 'VIEW')
                ORDER BY t.table_name
            """, (schema,))
            tables_raw = cursor.fetchall()

            tables = []
            risks = []
            total_rows = 0

            for table_info in tables_raw:
                table_name = table_info[0]
                row_count = int(table_info[3]) if table_info[3] else 0
                total_rows += row_count

                # Get columns
                cursor.execute("""
                    SELECT
                        c.column_name,
                        c.data_type,
                        c.udt_name,
                        c.is_nullable,
                        c.column_default,
                        c.character_maximum_length,
                        c.numeric_precision,
                        c.numeric_scale,
                        pg_catalog.col_description(
                            (SELECT oid FROM pg_class WHERE relname = c.table_name), c.ordinal_position
                        ) as comment
                    FROM information_schema.columns c
                    WHERE c.table_schema = %s AND c.table_name = %s
                    ORDER BY c.ordinal_position
                """, (schema, table_name))
                columns_raw = cursor.fetchall()

                columns = []
                for col in columns_raw:
                    column = {
                        "name": col[0],
                        "data_type": col[1],
                        "udt_name": col[2],
                        "nullable": col[3] == 'YES',
                        "default": col[4],
                        "max_length": col[5],
                        "precision": col[6],
                        "scale": col[7],
                        "comment": col[8]
                    }
                    columns.append(column)

                # Get primary key
                cursor.execute("""
                    SELECT a.attname
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    JOIN pg_class c ON c.oid = i.indrelid
                    WHERE c.relname = %s AND i.indisprimary
                """, (table_name,))
                pk_columns = [row[0] for row in cursor.fetchall()]
                has_primary_key = len(pk_columns) > 0

                # Get indexes
                cursor.execute("""
                    SELECT
                        i.relname as index_name,
                        ix.indisunique,
                        array_agg(a.attname ORDER BY array_position(ix.indkey, a.attnum))
                    FROM pg_class t
                    JOIN pg_index ix ON t.oid = ix.indrelid
                    JOIN pg_class i ON i.oid = ix.indexrelid
                    JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
                    WHERE t.relname = %s AND NOT ix.indisprimary
                    GROUP BY i.relname, ix.indisunique
                """, (table_name,))
                indexes_raw = cursor.fetchall()

                indexes = []
                for idx in indexes_raw:
                    indexes.append({
                        "name": idx[0],
                        "unique": idx[1],
                        "columns": idx[2]
                    })

                table = {
                    "name": table_name,
                    "type": table_info[1],
                    "row_count": row_count,
                    "comment": table_info[2],
                    "columns": columns,
                    "indexes": indexes,
                    "primary_key": pk_columns,
                    "has_primary_key": has_primary_key
                }
                tables.append(table)

                # Risk: no primary key
                if not has_primary_key:
                    risks.append({
                        "table": table_name,
                        "column": None,
                        "type": "no_primary_key",
                        "severity": "error",
                        "message": f"Table '{table_name}' has no primary key"
                    })

                # Risk: large table
                if row_count and row_count > 1000000:
                    risks.append({
                        "table": table_name,
                        "column": None,
                        "type": "large_table",
                        "severity": "info",
                        "message": f"Table '{table_name}' has ~{row_count:,} rows"
                    })

            cursor.close()
            conn.close()

            return {
                "success": True,
                "database": database,
                "schema": schema,
                "db_type": "postgres",
                "tables_count": len(tables),
                "total_rows": total_rows,
                "tables": tables,
                "risks": risks
            }

        except psycopg2.Error as e:
            return {
                "success": False,
                "error": f"PostgreSQL error: {str(e)}",
                "tables_count": 0,
                "total_rows": 0,
                "tables": [],
                "risks": []
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Analysis failed: {str(e)}",
                "tables_count": 0,
                "total_rows": 0,
                "tables": [],
                "risks": []
            }

    @staticmethod
    def analyze_mssql(
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
        ssl: bool = False,
        schema: str = "dbo"
    ) -> dict:
        """Analyze MSSQL database schema."""
        try:
            conn = pymssql.connect(
                server=host,
                port=port,
                user=username,
                password=password,
                database=database,
                login_timeout=30
            )
            cursor = conn.cursor(as_dict=True)

            # Get all tables
            cursor.execute("""
                SELECT
                    t.TABLE_NAME,
                    t.TABLE_TYPE,
                    (SELECT SUM(p.rows) FROM sys.partitions p
                     JOIN sys.tables tb ON p.object_id = tb.object_id
                     WHERE tb.name = t.TABLE_NAME AND p.index_id < 2) as row_count,
                    ep.value as comment
                FROM INFORMATION_SCHEMA.TABLES t
                LEFT JOIN sys.extended_properties ep
                    ON ep.major_id = OBJECT_ID(t.TABLE_SCHEMA + '.' + t.TABLE_NAME)
                    AND ep.minor_id = 0
                    AND ep.name = 'MS_Description'
                WHERE t.TABLE_SCHEMA = %s
                ORDER BY t.TABLE_NAME
            """, (schema,))
            tables_raw = cursor.fetchall()

            tables = []
            risks = []
            total_rows = 0

            for table_info in tables_raw:
                table_name = table_info['TABLE_NAME']
                row_count = table_info['row_count'] or 0
                total_rows += row_count

                # Get columns
                cursor.execute("""
                    SELECT
                        c.COLUMN_NAME,
                        c.DATA_TYPE,
                        c.IS_NULLABLE,
                        c.COLUMN_DEFAULT,
                        c.CHARACTER_MAXIMUM_LENGTH,
                        c.NUMERIC_PRECISION,
                        c.NUMERIC_SCALE,
                        c.COLLATION_NAME,
                        ep.value as comment
                    FROM INFORMATION_SCHEMA.COLUMNS c
                    LEFT JOIN sys.extended_properties ep
                        ON ep.major_id = OBJECT_ID(c.TABLE_SCHEMA + '.' + c.TABLE_NAME)
                        AND ep.minor_id = c.ORDINAL_POSITION
                        AND ep.name = 'MS_Description'
                    WHERE c.TABLE_SCHEMA = %s AND c.TABLE_NAME = %s
                    ORDER BY c.ORDINAL_POSITION
                """, (schema, table_name))
                columns_raw = cursor.fetchall()

                columns = []
                for col in columns_raw:
                    column = {
                        "name": col['COLUMN_NAME'],
                        "data_type": col['DATA_TYPE'],
                        "nullable": col['IS_NULLABLE'] == 'YES',
                        "default": col['COLUMN_DEFAULT'],
                        "max_length": col['CHARACTER_MAXIMUM_LENGTH'],
                        "precision": col['NUMERIC_PRECISION'],
                        "scale": col['NUMERIC_SCALE'],
                        "collation": col['COLLATION_NAME'],
                        "comment": col['comment']
                    }
                    columns.append(column)

                    # Detect risky MSSQL types for Snowflake migration
                    risky_types = ['xml', 'geography', 'geometry', 'hierarchyid', 'sql_variant', 'image', 'text', 'ntext']
                    if col['DATA_TYPE'].lower() in risky_types:
                        risks.append({
                            "table": table_name,
                            "column": col['COLUMN_NAME'],
                            "type": "risky_type",
                            "severity": "warning",
                            "message": f"Type '{col['DATA_TYPE']}' requires special handling for Snowflake migration"
                        })

                # Get primary key
                cursor.execute("""
                    SELECT COLUMN_NAME
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                    WHERE OBJECTPROPERTY(OBJECT_ID(CONSTRAINT_SCHEMA + '.' + CONSTRAINT_NAME), 'IsPrimaryKey') = 1
                      AND TABLE_SCHEMA = %s AND TABLE_NAME = %s
                    ORDER BY ORDINAL_POSITION
                """, (schema, table_name))
                pk_columns = [row['COLUMN_NAME'] for row in cursor.fetchall()]
                has_primary_key = len(pk_columns) > 0

                # Get indexes
                cursor.execute("""
                    SELECT
                        i.name as index_name,
                        i.is_unique,
                        STRING_AGG(c.name, ',') WITHIN GROUP (ORDER BY ic.key_ordinal) as columns
                    FROM sys.indexes i
                    JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
                    JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
                    JOIN sys.tables t ON i.object_id = t.object_id
                    JOIN sys.schemas s ON t.schema_id = s.schema_id
                    WHERE s.name = %s AND t.name = %s AND i.is_primary_key = 0 AND i.type > 0
                    GROUP BY i.name, i.is_unique
                """, (schema, table_name))
                indexes_raw = cursor.fetchall()

                indexes = []
                for idx in indexes_raw:
                    if idx['index_name']:
                        indexes.append({
                            "name": idx['index_name'],
                            "unique": idx['is_unique'],
                            "columns": idx['columns'].split(',') if idx['columns'] else []
                        })

                table = {
                    "name": table_name,
                    "type": table_info['TABLE_TYPE'],
                    "row_count": row_count,
                    "comment": table_info['comment'],
                    "columns": columns,
                    "indexes": indexes,
                    "primary_key": pk_columns,
                    "has_primary_key": has_primary_key
                }
                tables.append(table)

                # Risk: no primary key
                if not has_primary_key:
                    risks.append({
                        "table": table_name,
                        "column": None,
                        "type": "no_primary_key",
                        "severity": "error",
                        "message": f"Table '{table_name}' has no primary key - required for incremental sync"
                    })

                # Risk: large table
                if row_count and row_count > 1000000:
                    risks.append({
                        "table": table_name,
                        "column": None,
                        "type": "large_table",
                        "severity": "info",
                        "message": f"Table '{table_name}' has {row_count:,} rows - consider chunked migration"
                    })

            cursor.close()
            conn.close()

            return {
                "success": True,
                "database": database,
                "schema": schema,
                "db_type": "mssql",
                "tables_count": len(tables),
                "total_rows": total_rows,
                "tables": tables,
                "risks": risks
            }

        except pymssql.Error as e:
            return {
                "success": False,
                "error": f"MSSQL error: {str(e)}",
                "tables_count": 0,
                "total_rows": 0,
                "tables": [],
                "risks": []
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Analysis failed: {str(e)}",
                "tables_count": 0,
                "total_rows": 0,
                "tables": [],
                "risks": []
            }

    @classmethod
    def analyze(
        cls,
        db_type: DatabaseType,
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
        ssl: bool = False,
        schema: str = "public"
    ) -> dict:
        """Analyze database schema based on type."""
        if db_type == DatabaseType.MSSQL:
            return cls.analyze_mssql(host, port, database, username, password, ssl, schema or "dbo")
        elif db_type == DatabaseType.MYSQL:
            return cls.analyze_mysql(host, port, database, username, password, ssl)
        elif db_type == DatabaseType.POSTGRES:
            return cls.analyze_postgres(host, port, database, username, password, ssl, schema)
        else:
            return {
                "success": False,
                "error": f"Unsupported database type for analysis: {db_type}",
                "tables_count": 0,
                "total_rows": 0,
                "tables": [],
                "risks": []
            }
