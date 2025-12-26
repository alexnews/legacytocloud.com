from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.encryption import decrypt_password
from app.models import User, Connection, Project, SchemaAnalysis, AnalysisStatus
from app.schemas import (
    AnalysisRequest, AnalysisResponse, AnalysisDetailResponse,
    QuickAnalysisRequest, QuickAnalysisResponse
)
from app.services.schema_analyzer import SchemaAnalyzer

router = APIRouter()


@router.get("/project/{project_id}", response_model=list[AnalysisResponse])
async def list_project_analyses(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all analyses for a project."""
    # Verify project ownership
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id, Project.owner_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    result = await db.execute(
        select(SchemaAnalysis)
        .where(SchemaAnalysis.project_id == project_id)
        .order_by(SchemaAnalysis.created_at.desc())
    )
    analyses = result.scalars().all()

    return analyses


@router.post("/quick", response_model=QuickAnalysisResponse)
async def quick_analysis(
    request: QuickAnalysisRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Run a quick schema analysis on a connection without creating a project.
    Useful for testing connections and previewing schemas.
    """
    # Get connection
    result = await db.execute(
        select(Connection)
        .where(Connection.id == request.connection_id, Connection.owner_id == current_user.id)
    )
    connection = result.scalar_one_or_none()

    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Connection not found"
        )

    # Decrypt password and run analysis
    password = decrypt_password(connection.password_encrypted)

    analysis_result = SchemaAnalyzer.analyze(
        db_type=connection.db_type,
        host=connection.host,
        port=connection.port,
        database=connection.database,
        username=connection.username,
        password=password,
        ssl=connection.ssl_enabled,
        schema=connection.schema_name or "public"
    )

    return QuickAnalysisResponse(**analysis_result)


@router.post("/run/{project_id}", response_model=AnalysisResponse)
async def run_analysis(
    project_id: str,
    request: AnalysisRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Run schema analysis for a project and store results.
    This is the full analysis that saves to database.
    """
    # Get project
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id, Project.owner_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Get connection
    result = await db.execute(
        select(Connection)
        .where(Connection.id == request.connection_id, Connection.owner_id == current_user.id)
    )
    connection = result.scalar_one_or_none()

    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Connection not found"
        )

    # Create analysis record
    analysis = SchemaAnalysis(
        project_id=project_id,
        connection_id=request.connection_id,
        status=AnalysisStatus.RUNNING,
        started_at=datetime.utcnow()
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)

    # Run analysis
    password = decrypt_password(connection.password_encrypted)

    analysis_result = SchemaAnalyzer.analyze(
        db_type=connection.db_type,
        host=connection.host,
        port=connection.port,
        database=connection.database,
        username=connection.username,
        password=password,
        ssl=connection.ssl_enabled,
        schema=connection.schema_name or "public"
    )

    # Update analysis with results
    if analysis_result["success"]:
        analysis.status = AnalysisStatus.COMPLETED
        analysis.tables_count = analysis_result["tables_count"]
        analysis.total_rows = analysis_result["total_rows"]
        analysis.schema_data = {
            "database": analysis_result.get("database"),
            "db_type": analysis_result.get("db_type"),
            "tables": analysis_result["tables"]
        }
        analysis.risks = analysis_result["risks"]
    else:
        analysis.status = AnalysisStatus.FAILED
        analysis.error_message = analysis_result.get("error", "Unknown error")

    analysis.completed_at = datetime.utcnow()
    await db.commit()
    await db.refresh(analysis)

    return analysis


@router.get("/{analysis_id}", response_model=AnalysisDetailResponse)
async def get_analysis(
    analysis_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get analysis results with full schema data."""
    result = await db.execute(
        select(SchemaAnalysis)
        .join(Project)
        .where(SchemaAnalysis.id == analysis_id, Project.owner_id == current_user.id)
    )
    analysis = result.scalar_one_or_none()

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )

    return analysis


@router.get("/{analysis_id}/tables")
async def get_analysis_tables(
    analysis_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of tables from analysis."""
    result = await db.execute(
        select(SchemaAnalysis)
        .join(Project)
        .where(SchemaAnalysis.id == analysis_id, Project.owner_id == current_user.id)
    )
    analysis = result.scalar_one_or_none()

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )

    if not analysis.schema_data:
        return {"tables": []}

    return {"tables": analysis.schema_data.get("tables", [])}


@router.get("/{analysis_id}/risks")
async def get_analysis_risks(
    analysis_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get identified risks from analysis."""
    result = await db.execute(
        select(SchemaAnalysis)
        .join(Project)
        .where(SchemaAnalysis.id == analysis_id, Project.owner_id == current_user.id)
    )
    analysis = result.scalar_one_or_none()

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )

    return {
        "risks": analysis.risks or [],
        "summary": {
            "errors": len([r for r in (analysis.risks or []) if r.get("severity") == "error"]),
            "warnings": len([r for r in (analysis.risks or []) if r.get("severity") == "warning"]),
            "info": len([r for r in (analysis.risks or []) if r.get("severity") == "info"])
        }
    }
