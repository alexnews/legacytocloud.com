from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.connection import DatabaseType


class ConnectionCreate(BaseModel):
    name: str
    db_type: DatabaseType
    host: str
    port: int
    database: str
    username: str
    password: str
    ssl_enabled: bool = False
    # Snowflake-specific
    warehouse: Optional[str] = None
    schema_name: Optional[str] = None
    role: Optional[str] = None


class ConnectionTest(BaseModel):
    db_type: DatabaseType
    host: str
    port: int
    database: str
    username: str
    password: str
    ssl_enabled: bool = False
    warehouse: Optional[str] = None
    schema_name: Optional[str] = None
    role: Optional[str] = None


class ConnectionResponse(BaseModel):
    id: str
    name: str
    db_type: DatabaseType
    host: str
    port: int
    database: str
    username: str
    ssl_enabled: bool
    warehouse: Optional[str]
    schema_name: Optional[str]
    role: Optional[str]
    is_tested: bool
    last_tested_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class ConnectionList(BaseModel):
    connections: list[ConnectionResponse]
    total: int


class ConnectionTestResult(BaseModel):
    success: bool
    message: str
    details: Optional[dict] = None
