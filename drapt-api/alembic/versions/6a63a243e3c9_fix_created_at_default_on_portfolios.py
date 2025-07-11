"""Fix created_at default on portfolios

Revision ID: 6a63a243e3c9
Revises: de79418f2c4f
Create Date: 2025-07-11 21:12:27.795765

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision: str = 'e3f13d7c2d01'
down_revision: Union[str, Sequence[str], None] = 'de79418f2c4f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Rename the old table
    op.rename_table("portfolios", "portfolios_old")

    # 2. Create new table with default on created_at
    op.create_table(
        "portfolios",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("portfolio_string_id", sa.String(length=50), nullable=False, unique=True),
        sa.Column("name", sa.String(length=100), nullable=False, unique=True),
        sa.Column("description", sa.String(length=1024), nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.text("(datetime('now'))")),
    )

    # 3. Copy the data across
    op.execute("""
        INSERT INTO portfolios (id, portfolio_string_id, name, description, created_at)
        SELECT id, portfolio_string_id, name, description, created_at FROM portfolios_old
    """)

    # 4. Drop the old table
    op.drop_table("portfolios_old")


def downgrade() -> None:
    # 1. Rename current table
    op.rename_table("portfolios", "portfolios_new")

    # 2. Recreate table without default
    op.create_table(
        "portfolios",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("portfolio_string_id", sa.String(length=50), nullable=False, unique=True),
        sa.Column("name", sa.String(length=100), nullable=False, unique=True),
        sa.Column("description", sa.String(length=1024), nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    # 3. Copy back
    op.execute("""
        INSERT INTO portfolios (id, portfolio_string_id, name, description, created_at)
        SELECT id, portfolio_string_id, name, description, created_at FROM portfolios_new
    """)

    # 4. Drop the temp table
    op.drop_table("portfolios_new")
