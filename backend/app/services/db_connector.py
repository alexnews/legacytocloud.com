"""Database connector service for testing connections and running queries."""
import pymysql
import psycopg2
import pymssql
from typing import Optional
from app.models.connection import DatabaseType


class DatabaseConnector:
    """Service to connect and test database connections."""

    @staticmethod
    def test_mysql(
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
        ssl: bool = False
    ) -> dict:
        """Test MySQL connection."""
        try:
            ssl_config = {"ssl": {"ssl_mode": "require"}} if ssl else {}
            conn = pymysql.connect(
                host=host,
                port=port,
                user=username,
                password=password,
                database=database,
                connect_timeout=10,
                **ssl_config
            )

            # Get server info
            cursor = conn.cursor()
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()[0]

            cursor.execute("SELECT DATABASE()")
            db_name = cursor.fetchone()[0]

            cursor.close()
            conn.close()

            return {
                "success": True,
                "message": "Connection successful",
                "details": {
                    "server_version": version,
                    "database": db_name,
                    "db_type": "mysql"
                }
            }
        except pymysql.Error as e:
            return {
                "success": False,
                "message": f"MySQL connection failed: {str(e)}",
                "details": {"error_code": e.args[0] if e.args else None}
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Connection failed: {str(e)}",
                "details": None
            }

    @staticmethod
    def test_postgres(
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
        ssl: bool = False
    ) -> dict:
        """Test PostgreSQL connection."""
        try:
            sslmode = "require" if ssl else "prefer"
            conn = psycopg2.connect(
                host=host,
                port=port,
                user=username,
                password=password,
                dbname=database,
                sslmode=sslmode,
                connect_timeout=10
            )

            # Get server info
            cursor = conn.cursor()
            cursor.execute("SELECT version()")
            version = cursor.fetchone()[0]

            cursor.execute("SELECT current_database()")
            db_name = cursor.fetchone()[0]

            cursor.close()
            conn.close()

            return {
                "success": True,
                "message": "Connection successful",
                "details": {
                    "server_version": version,
                    "database": db_name,
                    "db_type": "postgres"
                }
            }
        except psycopg2.Error as e:
            return {
                "success": False,
                "message": f"PostgreSQL connection failed: {str(e)}",
                "details": {"error_code": e.pgcode if hasattr(e, 'pgcode') else None}
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Connection failed: {str(e)}",
                "details": None
            }

    @staticmethod
    def test_mssql(
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
        ssl: bool = False
    ) -> dict:
        """Test MSSQL connection."""
        try:
            conn = pymssql.connect(
                server=host,
                port=port,
                user=username,
                password=password,
                database=database,
                login_timeout=10
            )

            # Get server info
            cursor = conn.cursor()
            cursor.execute("SELECT @@VERSION")
            version = cursor.fetchone()[0]

            cursor.execute("SELECT DB_NAME()")
            db_name = cursor.fetchone()[0]

            cursor.close()
            conn.close()

            return {
                "success": True,
                "message": "Connection successful",
                "details": {
                    "server_version": version.split('\n')[0],  # First line of version
                    "database": db_name,
                    "db_type": "mssql"
                }
            }
        except pymssql.Error as e:
            return {
                "success": False,
                "message": f"MSSQL connection failed: {str(e)}",
                "details": None
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Connection failed: {str(e)}",
                "details": None
            }

    @staticmethod
    def test_snowflake(
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
        warehouse: Optional[str] = None,
        schema_name: Optional[str] = None,
        role: Optional[str] = None,
        ssl: bool = True
    ) -> dict:
        """Test Snowflake connection."""
        # Snowflake requires snowflake-connector-python
        # For MVP, we'll return a placeholder
        return {
            "success": False,
            "message": "Snowflake connector not yet implemented. Install snowflake-connector-python.",
            "details": {"note": "Coming in next release"}
        }

    @classmethod
    def test_connection(
        cls,
        db_type: DatabaseType,
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
        ssl: bool = False,
        warehouse: Optional[str] = None,
        schema_name: Optional[str] = None,
        role: Optional[str] = None
    ) -> dict:
        """Test database connection based on type."""
        if db_type == DatabaseType.MSSQL:
            return cls.test_mssql(host, port, database, username, password, ssl)
        elif db_type == DatabaseType.MYSQL:
            return cls.test_mysql(host, port, database, username, password, ssl)
        elif db_type == DatabaseType.POSTGRES:
            return cls.test_postgres(host, port, database, username, password, ssl)
        elif db_type == DatabaseType.SNOWFLAKE:
            return cls.test_snowflake(
                host, port, database, username, password,
                warehouse, schema_name, role, ssl
            )
        else:
            return {
                "success": False,
                "message": f"Unsupported database type: {db_type}",
                "details": None
            }
