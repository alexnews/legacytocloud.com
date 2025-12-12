from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base


class MigrationType(str, enum.Enum):
    # Cloud migration paths (primary)
    MSSQL_TO_SNOWFLAKE = "mssql_to_snowflake"
    MYSQL_TO_SNOWFLAKE = "mysql_to_snowflake"
    POSTGRES_TO_SNOWFLAKE = "postgres_to_snowflake"
    # Legacy (for backward compatibility with existing data)
    MYSQL_TO_POSTGRES = "mysql_to_postgres"


class ProjectStatus(str, enum.Enum):
    CREATED = "created"
    ANALYZING = "analyzing"
    ANALYZED = "analyzed"
    PLANNING = "planning"
    PLANNED = "planned"
    MIGRATING = "migrating"
    VALIDATING = "validating"
    COMPLETED = "completed"
    FAILED = "failed"


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    migration_type = Column(Enum(MigrationType, values_callable=lambda x: [e.value for e in x]), nullable=False)
    status = Column(Enum(ProjectStatus, values_callable=lambda x: [e.value for e in x]), default=ProjectStatus.CREATED)

    # Foreign keys
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    source_connection_id = Column(String(36), ForeignKey("connections.id"), nullable=True)
    target_connection_id = Column(String(36), ForeignKey("connections.id"), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="projects")
    source_connection = relationship("Connection", foreign_keys=[source_connection_id])
    target_connection = relationship("Connection", foreign_keys=[target_connection_id])
    schema_analyses = relationship("SchemaAnalysis", back_populates="project", cascade="all, delete-orphan")
