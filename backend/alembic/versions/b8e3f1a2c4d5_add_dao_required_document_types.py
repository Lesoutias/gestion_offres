"""add dao required_document_types

Revision ID: b8e3f1a2c4d5
Revises: a7f2c9d1e4b0
Create Date: 2026-06-11 18:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "b8e3f1a2c4d5"
down_revision: Union[str, Sequence[str], None] = "a7f2c9d1e4b0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "dao_documents",
        sa.Column("required_document_types", sa.JSON(), nullable=False, server_default="[]"),
    )


def downgrade() -> None:
    op.drop_column("dao_documents", "required_document_types")
