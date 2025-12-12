from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base


class DatabaseType(str, enum.Enum):
    MSSQL = "mssql"
    MYSQL = "mysql"
    POSTGRES = "postgres"
    SNOWFLAKE = "snowflake"


class Connection(Base):
    __tablename__ = "connections"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    db_type = Column(Enum(DatabaseType, values_callable=lambda x: [e.value for e in x]), nullable=False)

    # Connection details
    host = Column(String(255), nullable=False)
    port = Column(Integer, nullable=False)
    database = Column(String(255), nullable=False)
    username = Column(String(255), nullable=False)
    password_encrypted = Column(Text, nullable=False)  # Encrypted password
    ssl_enabled = Column(Boolean, default=False)

    # Snowflake-specific
    warehouse = Column(String(255), nullable=True)
    schema_name = Column(String(255), nullable=True)
    role = Column(String(255), nullable=True)

    # Metadata
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    is_tested = Column(Boolean, default=False)
    last_tested_at = Column(DateTime(timezone=True), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
