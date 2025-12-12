from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base


class AnalysisStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class SchemaAnalysis(Base):
    __tablename__ = "schema_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    connection_id = Column(String(36), ForeignKey("connections.id"), nullable=False)

    status = Column(Enum(AnalysisStatus, values_callable=lambda x: [e.value for e in x]), default=AnalysisStatus.PENDING)

    # Results stored as JSON
    tables_count = Column(Integer, default=0)
    total_rows = Column(Integer, default=0)
    schema_data = Column(JSON, nullable=True)  # Full schema details
    risks = Column(JSON, nullable=True)  # Identified risks

    # Error handling
    error_message = Column(Text, nullable=True)

    # Timestamps
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    project = relationship("Project", back_populates="schema_analyses")
