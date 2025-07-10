"""255 char description for portfolio upgraded to 1024 chars

Revision ID: de79418f2c4f
Revises: 4eac1bc28a48
Create Date: 2025-07-10 12:01:02.296974

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'de79418f2c4f'
down_revision: Union[str, Sequence[str], None] = '4eac1bc28a48'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. Rename old table
    op.rename_table("portfolios", "portfolios_old")

    # 2. Create new table with updated description length
    op.create_table(
        "portfolios",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("portfolio_string_id", sa.String, nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.String(length=1024), nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    # 3. Copy data over
    op.execute("""
        INSERT INTO portfolios (id, portfolio_string_id, name, description, created_at)
        SELECT id, portfolio_string_id, name, description, created_at
        FROM portfolios_old
    """)

    # 4. Drop old table
    op.drop_table("portfolios_old")


def downgrade() -> None:
    """Downgrade schema."""
    op.rename_table("portfolios", "portfolios_new")

    op.create_table(
        "portfolios",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("portfolio_string_id", sa.String, nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    op.execute("""
        INSERT INTO portfolios (id, portfolio_string_id, name, description, created_at)
        SELECT id, portfolio_string_id, name, description, created_at
        FROM portfolios_new
    """)

    op.drop_table("portfolios_new")
