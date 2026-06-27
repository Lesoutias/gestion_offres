"""add offer commission score

Revision ID: f3a7b9c1d4e6
Revises: e2f6a8b0c3d5
Create Date: 2026-06-27 23:00:00.000000
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "f3a7b9c1d4e6"
down_revision: Union[str, Sequence[str], None] = "e2f6a8b0c3d5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("offers", sa.Column("score_commission", sa.Float(), nullable=True))


def downgrade() -> None:
    op.drop_column("offers", "score_commission")
