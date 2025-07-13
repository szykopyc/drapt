"""Trade table

Revision ID: 30e01fb88716
Revises: e76edd5b1d0d
Create Date: 2025-07-13 22:07:41.910220

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '30e01fb88716'
down_revision: Union[str, Sequence[str], None] = 'e76edd5b1d0d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'trades',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('portfolio_id', sa.Integer, sa.ForeignKey('portfolios.id'), nullable=False, index=True),
        sa.Column('ticker', sa.String(length=6), nullable=False),
        sa.Column('price', sa.Numeric(18, 6), nullable=False),
        sa.Column('direction', sa.String(length=10), nullable=False),  # Store enum as string
        sa.Column('quantity', sa.Numeric(18, 6), nullable=False),
        sa.Column('execution_date', sa.DateTime, nullable=False),  # Set in app, no default in SQLite
        sa.Column('venue', sa.String(length=100), nullable=False, server_default='t212'),
        sa.Column('trader_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('analyst_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('notes', sa.String(length=1024), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('trades')
