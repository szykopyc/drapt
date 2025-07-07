"""Removed pm_id from portfolio model

Revision ID: 4eac1bc28a48
Revises: 8d3ad68e10b1
Create Date: 2025-07-07 20:35:36.210192

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4eac1bc28a48'
down_revision: Union[str, Sequence[str], None] = '8d3ad68e10b1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('portfolios', schema=None) as batch_op:
        batch_op.drop_column('pm_id')

def downgrade() -> None:
    with op.batch_alter_table('portfolios', schema=None) as batch_op:
        batch_op.add_column(sa.Column('pm_id', sa.INTEGER(), nullable=False))
        batch_op.create_foreign_key('pm_id', 'users', ['pm_id'], ['id'])