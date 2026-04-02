"""Add pgvector extension and article_embeddings table.

Revision ID: 005
Revises: 004_articles
Create Date: 2026-03-31
"""
from alembic import op

revision = "005"
down_revision = "004_articles"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.execute("""
        CREATE TABLE pipeline.article_embeddings (
            id SERIAL PRIMARY KEY,
            article_id INTEGER NOT NULL UNIQUE
                REFERENCES pipeline.articles(id) ON DELETE CASCADE,
            embedding vector(384) NOT NULL,
            model_name VARCHAR(100) NOT NULL DEFAULT 'all-MiniLM-L6-v2',
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
    """)

    op.execute(
        "CREATE INDEX ix_article_embeddings_vector "
        "ON pipeline.article_embeddings "
        "USING hnsw (embedding vector_cosine_ops)"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS pipeline.ix_article_embeddings_vector")
    op.execute("DROP TABLE IF EXISTS pipeline.article_embeddings")
