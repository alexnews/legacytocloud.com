from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.project import MigrationType, ProjectStatus


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    migration_type: MigrationType


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    source_connection_id: Optional[str] = None
    target_connection_id: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    migration_type: MigrationType
    status: ProjectStatus
    owner_id: str
    source_connection_id: Optional[str]
    target_connection_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectList(BaseModel):
    projects: list[ProjectResponse]
    total: int
