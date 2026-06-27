"""add offer draft status

Revision ID: e2f6a8b0c3d5
Revises: d1e5f7a9b2c4
Create Date: 2026-06-27 22:30:00.000000
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "e2f6a8b0c3d5"
down_revision: Union[str, Sequence[str], None] = "d1e5f7a9b2c4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("offers", "statut", existing_type=sa.String(length=50), server_default="draft")


def downgrade() -> None:
    op.alter_column("offers", "statut", existing_type=sa.String(length=50), server_default="submitted")
