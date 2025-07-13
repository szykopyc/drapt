"""Fixed created_at to be creation date because for some reason it was removed

Revision ID: e76edd5b1d0d
Revises: 3ab132e0d34d
Create Date: 2025-07-13 18:10:17.747340

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e76edd5b1d0d'
down_revision: Union[str, Sequence[str], None] = '3ab132e0d34d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    # 1. Rename old table
    op.rename_table("portfolios", "portfolios_old")

    # 2. Create new table with updated defaults
    op.create_table(
        "portfolios",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("portfolio_string_id", sa.String, nullable=False),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.String(length=1024), nullable=True),
        sa.Column("initial_cash", sa.Numeric(18, 2), nullable=False, server_default="0.00"),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="GBP"),
    )

    # 3. Copy data from old table
    op.execute("""
        INSERT INTO portfolios (id, portfolio_string_id, name, description, initial_cash, created_at, currency)
        SELECT id, portfolio_string_id, name, description, initial_cash, created_at, currency
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
        sa.Column("description", sa.String(length=1024), nullable=True),
        sa.Column("initial_cash", sa.Numeric(18, 2), nullable=False, server_default="0.00"),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="GBP"),
    )

    op.execute("""
        INSERT INTO portfolios (id, portfolio_string_id, name, description, initial_cash, created_at, currency)
        SELECT id, portfolio_string_id, name, description, initial_cash, created_at, currency
        FROM portfolios_new
    """)

    op.drop_table("portfolios_new")
