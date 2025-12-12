"""update_enums_for_cloud_migration

Revision ID: 4aaf57694b1d
Revises: 001
Create Date: 2025-12-12 14:41:03.918261

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4aaf57694b1d'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add 'mssql' to databasetype enum
    op.execute("ALTER TYPE databasetype ADD VALUE IF NOT EXISTS 'mssql'")

    # Update migrationtype enum - need to recreate it
    # First, add new value
    op.execute("ALTER TYPE migrationtype ADD VALUE IF NOT EXISTS 'mssql_to_snowflake'")

    # Note: We're keeping mysql_to_postgres for backward compatibility with existing data
    # It can be removed later if needed


def downgrade() -> None:
    # PostgreSQL doesn't support removing enum values easily
    # Would need to recreate the enum type
    pass
