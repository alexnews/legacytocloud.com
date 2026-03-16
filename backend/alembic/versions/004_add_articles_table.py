"""Add articles table.

Revision ID: 004_articles
Revises: 003_pipeline
Create Date: 2026-03-16
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "004_articles"
down_revision = "003_pipeline"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "articles",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("pipeline_id", sa.Integer(), nullable=True),
        sa.Column("title", sa.String(length=512), nullable=False),
        sa.Column("slug", sa.String(length=300), nullable=False),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("summary", sa.String(length=500), nullable=True),
        sa.Column("original_url", sa.String(length=512), nullable=True),
        sa.Column("source", sa.String(length=120), nullable=True),
        sa.Column("image_url", sa.String(length=512), nullable=True),
        sa.Column("quality_score", sa.Integer(), nullable=True),
        sa.Column(
            "status",
            sa.String(length=20),
            nullable=False,
            server_default="published",
        ),
        sa.Column("published_at", sa.DateTime(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("pipeline_id", name="uq_articles_pipeline_id"),
        sa.UniqueConstraint("slug", name="uq_articles_slug"),
        schema="pipeline",
    )
    op.create_index(
        "ix_articles_slug",
        "articles",
        ["slug"],
        schema="pipeline",
    )
    op.create_index(
        "ix_articles_status",
        "articles",
        ["status"],
        schema="pipeline",
    )


def downgrade() -> None:
    op.drop_index("ix_articles_status", table_name="articles", schema="pipeline")
    op.drop_index("ix_articles_slug", table_name="articles", schema="pipeline")
    op.drop_table("articles", schema="pipeline")
