"""SQLAlchemy models for news articles (PostgreSQL pipeline schema)."""

from sqlalchemy import Column, DateTime, Integer, String, Text, func

from app.core.database import Base


class Article(Base):
    __tablename__ = "articles"
    __table_args__ = {"schema": "pipeline"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    pipeline_id = Column(Integer, nullable=True, unique=True)  # coollinks ID
    title = Column(String(512), nullable=False)
    slug = Column(String(300), nullable=False, unique=True)
    content = Column(Text, nullable=True)
    summary = Column(String(500), nullable=True)
    original_url = Column(String(512), nullable=True)
    source = Column(String(120), nullable=True)
    image_url = Column(String(512), nullable=True)
    quality_score = Column(Integer, nullable=True)
    status = Column(String(20), nullable=False, server_default="published")
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
