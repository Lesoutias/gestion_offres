"""add devise columns

Revision ID: a7f2c9d1e4b0
Revises: 33ab631ca7ad
Create Date: 2026-06-11 12:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "a7f2c9d1e4b0"
down_revision: Union[str, Sequence[str], None] = "33ab631ca7ad"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("offers", sa.Column("devise", sa.String(length=3), nullable=False, server_default="USD"))
    op.add_column("tender_calls", sa.Column("budget_devise", sa.String(length=3), nullable=False, server_default="USD"))
    op.add_column("public_contracts", sa.Column("devise", sa.String(length=3), nullable=False, server_default="USD"))


def downgrade() -> None:
    op.drop_column("public_contracts", "devise")
    op.drop_column("tender_calls", "budget_devise")
    op.drop_column("offers", "devise")
