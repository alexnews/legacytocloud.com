"""Initial schema - users, projects, connections, schema_analyses

Revision ID: 001
Revises:
Create Date: 2024-12-12

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False, index=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('is_verified', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Connections table
    op.create_table(
        'connections',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('db_type', sa.Enum('mysql', 'postgres', 'snowflake', name='databasetype'), nullable=False),
        sa.Column('host', sa.String(255), nullable=False),
        sa.Column('port', sa.Integer(), nullable=False),
        sa.Column('database', sa.String(255), nullable=False),
        sa.Column('username', sa.String(255), nullable=False),
        sa.Column('password_encrypted', sa.Text(), nullable=False),
        sa.Column('ssl_enabled', sa.Boolean(), default=False),
        sa.Column('warehouse', sa.String(255), nullable=True),
        sa.Column('schema_name', sa.String(255), nullable=True),
        sa.Column('role', sa.String(255), nullable=True),
        sa.Column('owner_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('is_tested', sa.Boolean(), default=False),
        sa.Column('last_tested_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Projects table
    op.create_table(
        'projects',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('migration_type', sa.Enum('mysql_to_postgres', 'mysql_to_snowflake', 'postgres_to_snowflake', name='migrationtype'), nullable=False),
        sa.Column('status', sa.Enum('created', 'analyzing', 'analyzed', 'planning', 'planned', 'migrating', 'validating', 'completed', 'failed', name='projectstatus'), default='created'),
        sa.Column('owner_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('source_connection_id', sa.String(36), sa.ForeignKey('connections.id'), nullable=True),
        sa.Column('target_connection_id', sa.String(36), sa.ForeignKey('connections.id'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Schema analyses table
    op.create_table(
        'schema_analyses',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('project_id', sa.String(36), sa.ForeignKey('projects.id'), nullable=False),
        sa.Column('connection_id', sa.String(36), sa.ForeignKey('connections.id'), nullable=False),
        sa.Column('status', sa.Enum('pending', 'running', 'completed', 'failed', name='analysisstatus'), default='pending'),
        sa.Column('tables_count', sa.Integer(), default=0),
        sa.Column('total_rows', sa.Integer(), default=0),
        sa.Column('schema_data', sa.JSON(), nullable=True),
        sa.Column('risks', sa.JSON(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('schema_analyses')
    op.drop_table('projects')
    op.drop_table('connections')
    op.drop_table('users')

    # Drop enums
    op.execute('DROP TYPE IF EXISTS analysisstatus')
    op.execute('DROP TYPE IF EXISTS projectstatus')
    op.execute('DROP TYPE IF EXISTS migrationtype')
    op.execute('DROP TYPE IF EXISTS databasetype')
