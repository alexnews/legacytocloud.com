"""Add pgvector extension and article_embeddings table.

Revision ID: 005
Revises: 004_add_articles_table
Create Date: 2026-03-31
"""
from alembic import op
import sqlalchemy as sa

revision = "005"
down_revision = "004_articles"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "article_embeddings",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "article_id",
            sa.Integer(),
            sa.ForeignKey("pipeline.articles.id", ondelete="CASCADE"),
            unique=True,
            nullable=False,
        ),
        sa.Column("embedding", sa.LargeBinary(), nullable=False),  # pgvector handles via raw SQL
        sa.Column("model_name", sa.String(100), nullable=False, server_default="all-MiniLM-L6-v2"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        schema="pipeline",
    )

    # Replace the generic LargeBinary column with actual vector type
    op.execute(
        "ALTER TABLE pipeline.article_embeddings "
        "ALTER COLUMN embedding TYPE vector(384) USING embedding::vector(384)"
    )

    # HNSW index for fast cosine similarity search
    op.execute(
        "CREATE INDEX ix_article_embeddings_vector "
        "ON pipeline.article_embeddings "
        "USING hnsw (embedding vector_cosine_ops)"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS pipeline.ix_article_embeddings_vector")
    op.drop_table("article_embeddings", schema="pipeline")
