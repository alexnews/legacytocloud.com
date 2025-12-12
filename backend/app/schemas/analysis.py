from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime
from app.models.schema_analysis import AnalysisStatus


class AnalysisRequest(BaseModel):
    connection_id: str


class AnalysisResponse(BaseModel):
    id: str
    project_id: str
    connection_id: str
    status: AnalysisStatus
    tables_count: int
    total_rows: int
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AnalysisDetailResponse(AnalysisResponse):
    schema_data: Optional[dict] = None
    risks: Optional[list] = None


class QuickAnalysisRequest(BaseModel):
    """For analyzing without saving - useful for testing."""
    connection_id: str


class QuickAnalysisResponse(BaseModel):
    success: bool
    database: Optional[str] = None
    db_type: Optional[str] = None
    tables_count: int = 0
    total_rows: int = 0
    tables: list = []
    risks: list = []
    error: Optional[str] = None
