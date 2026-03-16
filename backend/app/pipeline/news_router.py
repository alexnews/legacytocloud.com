"""FastAPI router for news/articles endpoints."""

from __future__ import annotations

import math
import re
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.pipeline.news_models import Article

router = APIRouter()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class ArticleListItem(BaseModel):
    id: int
    title: str
    slug: str
    summary: str | None = None
    source: str | None = None
    image_url: str | None = None
    quality_score: int | None = None
    status: str
    published_at: datetime | None = None

    model_config = {"from_attributes": True}


class ArticleDetail(ArticleListItem):
    content_html: str | None = None
    original_url: str | None = None
    created_at: datetime
    updated_at: datetime


class ArticleListResponse(BaseModel):
    items: list[ArticleListItem]
    total: int
    page: int
    per_page: int
    total_pages: int


class SourceCount(BaseModel):
    source: str
    count: int


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _nl2p(text: str | None) -> str | None:
    """Convert plain text with double newlines to HTML paragraphs."""
    if not text:
        return None
    # Strip HTML tags if any
    clean = re.sub(r"<[^>]+>", "", text)
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", clean) if p.strip()]
    if not paragraphs:
        return None
    return "".join(f"<p>{p}</p>" for p in paragraphs)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/news/sources", response_model=list[SourceCount])
async def list_sources(db: AsyncSession = Depends(get_db)):
    """List distinct article sources with counts."""
    result = await db.execute(
        select(Article.source, func.count(Article.id).label("count"))
        .where(Article.status == "published")
        .where(Article.source.isnot(None))
        .group_by(Article.source)
        .order_by(func.count(Article.id).desc())
    )
    return [SourceCount(source=row.source, count=row.count) for row in result.all()]


@router.get("/news", response_model=ArticleListResponse)
async def list_articles(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=12, ge=1, le=100),
    source: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    """List published articles with pagination."""
    base = select(Article).where(Article.status == "published")
    count_q = select(func.count(Article.id)).where(Article.status == "published")

    if source:
        base = base.where(Article.source == source)
        count_q = count_q.where(Article.source == source)

    total = await db.scalar(count_q) or 0
    total_pages = max(1, math.ceil(total / per_page))

    result = await db.execute(
        base.order_by(Article.published_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    articles = result.scalars().all()

    return ArticleListResponse(
        items=[ArticleListItem.model_validate(a) for a in articles],
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.get("/news/{slug}", response_model=ArticleDetail)
async def get_article(slug: str, db: AsyncSession = Depends(get_db)):
    """Get a single article by slug."""
    result = await db.execute(
        select(Article).where(Article.slug == slug, Article.status == "published")
    )
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    return ArticleDetail(
        id=article.id,
        title=article.title,
        slug=article.slug,
        summary=article.summary,
        source=article.source,
        image_url=article.image_url,
        quality_score=article.quality_score,
        status=article.status,
        published_at=article.published_at,
        content_html=_nl2p(article.content),
        original_url=article.original_url,
        created_at=article.created_at,
        updated_at=article.updated_at,
    )
