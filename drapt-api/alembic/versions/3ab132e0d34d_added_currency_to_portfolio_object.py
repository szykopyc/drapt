"""Added currency to portfolio object

Revision ID: 3ab132e0d34d
Revises: e8582983a3d5
Create Date: 2025-07-13 18:02:15.385286

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3ab132e0d34d'
down_revision: Union[str, Sequence[str], None] = 'e8582983a3d5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    # 1. Rename old table
    op.rename_table("portfolios", "portfolios_old")

    # 2. Create new table with initial_cash field
    op.create_table(
        "portfolios",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("portfolio_string_id", sa.String, nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.String(length=1024), nullable=True),
        sa.Column("initial_cash", sa.Numeric(18, 2), nullable=False, server_default="0.00"),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False, default="GBP", server_default="GBP")
    )

    # 3. Copy data over
    op.execute("""
        INSERT INTO portfolios (id, portfolio_string_id, name, description, created_at)
        SELECT id, portfolio_string_id, name, description, created_at
        FROM portfolios_old
    """)

    # 4. Update initial_cash to 0.00 for existing records
    op.execute("""
        UPDATE portfolios SET initial_cash = 0.00
    """)

    # 5. Drop old table
    op.drop_table("portfolios_old")


def downgrade() -> None:
    """Downgrade schema."""
    op.rename_table("portfolios", "portfolios_new")

    op.create_table(
        "portfolios",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("portfolio_string_id", sa.String, nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.String(length=1024), nullable=True),
        sa.Column("initial_cash", sa.Numeric(18,2), nullable=False, server_default="0.00"),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    op.execute("""
        INSERT INTO portfolios (id, portfolio_string_id, name, description, created_at)
        SELECT id, portfolio_string_id, name, description, created_at
        FROM portfolios_new
    """)

    op.drop_table("portfolios_new")
