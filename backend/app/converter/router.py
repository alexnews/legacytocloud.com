"""FastAPI router for file conversion."""

from __future__ import annotations

import logging
import shutil
import tempfile
import zipfile
from pathlib import Path

from fastapi import APIRouter, File, Query, UploadFile, HTTPException
from fastapi.responses import StreamingResponse

from .detect import (
    MAX_FREE_SIZE,
    SUPPORTED_TARGETS,
    detect_format,
    resolve_target,
)
from .models import ConvertedData
from .readers import READERS
from .writers import WRITERS

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/convert/formats")
async def list_formats():
    """Return supported source and target formats."""
    return {
        "sources": sorted(READERS.keys()),
        "targets": sorted(SUPPORTED_TARGETS),
    }


@router.post("/convert")
async def convert_file(
    file: UploadFile = File(...),
    outputFormat: str = Query(..., description="Target format (csv, xlsx, mysql, postgresql, sqlite)"),
):
    """Upload a database file and convert it to the target format.

    Returns a ZIP archive with the converted file(s).
    """
    # Validate target format
    target = resolve_target(outputFormat)
    if not target:
        raise HTTPException(400, f"Unsupported target format: {outputFormat}")

    # Validate filename
    if not file.filename:
        raise HTTPException(400, "No filename provided.")

    # Detect source format
    source_fmt = detect_format(file.filename)
    if not source_fmt:
        raise HTTPException(
            400,
            f"Unsupported file type: {Path(file.filename).suffix}. "
            f"Supported: .csv, .tsv, .xls, .xlsx, .sqlite, .db, .sql, .dbf",
        )

    # Check file size (read into memory for small files, stream for large)
    content = await file.read()
    if len(content) > MAX_FREE_SIZE:
        raise HTTPException(
            413, f"File too large ({len(content) // 1024 // 1024}MB). Free limit is 10MB."
        )

    if len(content) == 0:
        raise HTTPException(400, "Empty file.")

    # Work in a temp directory
    tmp_dir = Path(tempfile.mkdtemp(prefix="ltc_convert_"))
    try:
        # Save uploaded file
        input_path = tmp_dir / file.filename
        input_path.write_bytes(content)

        # Read source
        reader = READERS.get(source_fmt)
        if not reader:
            raise HTTPException(500, f"No reader for format: {source_fmt}")

        try:
            data: ConvertedData = reader(input_path)
        except Exception as exc:
            logger.error("Reader error for %s: %s", source_fmt, exc)
            raise HTTPException(
                422, f"Failed to parse {file.filename}: {exc}"
            )

        if not data.tables:
            raise HTTPException(422, "No tables found in the uploaded file.")

        # Write to target
        writer = WRITERS.get(target)
        if not writer:
            raise HTTPException(500, f"No writer for format: {target}")

        output_dir = tmp_dir / "output"
        output_dir.mkdir()

        try:
            output_files = writer(data, output_dir)
        except Exception as exc:
            logger.error("Writer error for %s: %s", target, exc)
            raise HTTPException(
                422, f"Failed to convert to {target}: {exc}"
            )

        # Build ZIP
        zip_path = tmp_dir / "result.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            # Add converted files
            for fp in output_files:
                zf.write(fp, fp.name)

            # Add warnings file if any
            if data.warnings:
                zf.writestr("_warnings.txt", "\n".join(data.warnings))

        # Stream the ZIP back
        zip_bytes = zip_path.read_bytes()

        # Build a descriptive filename
        stem = Path(file.filename).stem
        response_name = f"{stem}_to_{target}.zip"

        return StreamingResponse(
            iter([zip_bytes]),
            media_type="application/zip",
            headers={
                "Content-Disposition": f'attachment; filename="{response_name}"',
                "Content-Length": str(len(zip_bytes)),
                "X-Source-Format": source_fmt,
                "X-Target-Format": target,
                "X-Tables-Count": str(len(data.tables)),
                "X-Total-Rows": str(sum(len(t.rows) for t in data.tables)),
                "X-Warnings-Count": str(len(data.warnings)),
            },
        )

    finally:
        # Clean up temp directory
        shutil.rmtree(tmp_dir, ignore_errors=True)
