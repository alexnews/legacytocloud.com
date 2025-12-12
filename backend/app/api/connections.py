from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.encryption import encrypt_password, decrypt_password
from app.models import User, Connection
from app.schemas import (
    ConnectionCreate, ConnectionTest, ConnectionResponse,
    ConnectionList, ConnectionTestResult
)
from app.services.db_connector import DatabaseConnector

router = APIRouter()


@router.get("/", response_model=ConnectionList)
async def list_connections(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all database connections for current user."""
    result = await db.execute(
        select(Connection)
        .where(Connection.owner_id == current_user.id)
        .order_by(Connection.created_at.desc())
    )
    connections = result.scalars().all()

    return ConnectionList(connections=connections, total=len(connections))


@router.post("/", response_model=ConnectionResponse, status_code=status.HTTP_201_CREATED)
async def create_connection(
    conn_data: ConnectionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new database connection."""
    connection = Connection(
        name=conn_data.name,
        db_type=conn_data.db_type,
        host=conn_data.host,
        port=conn_data.port,
        database=conn_data.database,
        username=conn_data.username,
        password_encrypted=encrypt_password(conn_data.password),
        ssl_enabled=conn_data.ssl_enabled,
        warehouse=conn_data.warehouse,
        schema_name=conn_data.schema_name,
        role=conn_data.role,
        owner_id=current_user.id
    )
    db.add(connection)
    await db.commit()
    await db.refresh(connection)

    return connection


@router.post("/test", response_model=ConnectionTestResult)
async def test_connection(conn_data: ConnectionTest):
    """Test database connection without saving."""
    result = DatabaseConnector.test_connection(
        db_type=conn_data.db_type,
        host=conn_data.host,
        port=conn_data.port,
        database=conn_data.database,
        username=conn_data.username,
        password=conn_data.password,
        ssl=conn_data.ssl_enabled,
        warehouse=conn_data.warehouse,
        schema_name=conn_data.schema_name,
        role=conn_data.role
    )

    return ConnectionTestResult(**result)


@router.post("/{connection_id}/test", response_model=ConnectionTestResult)
async def test_saved_connection(
    connection_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Test a saved database connection."""
    result = await db.execute(
        select(Connection)
        .where(Connection.id == connection_id, Connection.owner_id == current_user.id)
    )
    connection = result.scalar_one_or_none()

    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Connection not found"
        )

    # Decrypt password and test
    password = decrypt_password(connection.password_encrypted)

    test_result = DatabaseConnector.test_connection(
        db_type=connection.db_type,
        host=connection.host,
        port=connection.port,
        database=connection.database,
        username=connection.username,
        password=password,
        ssl=connection.ssl_enabled,
        warehouse=connection.warehouse,
        schema_name=connection.schema_name,
        role=connection.role
    )

    # Update connection test status
    connection.is_tested = test_result["success"]
    connection.last_tested_at = datetime.utcnow()
    await db.commit()

    return ConnectionTestResult(**test_result)


@router.get("/{connection_id}", response_model=ConnectionResponse)
async def get_connection(
    connection_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get connection details."""
    result = await db.execute(
        select(Connection)
        .where(Connection.id == connection_id, Connection.owner_id == current_user.id)
    )
    connection = result.scalar_one_or_none()

    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Connection not found"
        )

    return connection


@router.delete("/{connection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_connection(
    connection_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a database connection."""
    result = await db.execute(
        select(Connection)
        .where(Connection.id == connection_id, Connection.owner_id == current_user.id)
    )
    connection = result.scalar_one_or_none()

    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Connection not found"
        )

    await db.delete(connection)
    await db.commit()
