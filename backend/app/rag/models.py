"""SQLAlchemy model for article embeddings (pgvector)."""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from pgvector.sqlalchemy import Vector

from app.core.database import Base


class ArticleEmbedding(Base):
    __tablename__ = "article_embeddings"
    __table_args__ = {"schema": "pipeline"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    article_id = Column(
        Integer,
        ForeignKey("pipeline.articles.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    embedding = Column(Vector(384), nullable=False)
    model_name = Column(String(100), nullable=False, default="all-MiniLM-L6-v2")
    created_at = Column(DateTime, nullable=False, server_default=func.now())
