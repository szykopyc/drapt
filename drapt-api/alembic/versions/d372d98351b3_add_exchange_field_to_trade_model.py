"""Add exchange field to trade model

Revision ID: d372d98351b3
Revises: f33c2b00758d
Create Date: 2025-07-15 12:10:49.251826

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd372d98351b3'
down_revision: Union[str, Sequence[str], None] = 'f33c2b00758d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_table('trades')

    op.create_table(
        'trades',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('portfolio_id', sa.Integer, sa.ForeignKey('portfolios.id'), nullable=False, index=True),
        sa.Column('ticker', sa.String(length=6), nullable=False),
        sa.Column('exchange', sa.String(length=10), nullable=False),
        sa.Column('price', sa.Numeric(18, 6), nullable=False),
        sa.Column('quantity', sa.Numeric(18, 6), nullable=False),
        sa.Column('notional', sa.Numeric(18, 6), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('direction', sa.String(length=10), nullable=False),
        sa.Column('execution_date', sa.DateTime, nullable=False),
        sa.Column('venue', sa.String(length=100), nullable=False, server_default='t212'),
        sa.Column('trader_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('analyst_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('notes', sa.String(length=1024), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('trades')
