"""add submission document types catalog

Revision ID: d1e5f7a9b2c4
Revises: c9d4e2f3a5b6
Create Date: 2026-06-27 12:00:00.000000
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "d1e5f7a9b2c4"
down_revision: Union[str, Sequence[str], None] = "c9d4e2f3a5b6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "submission_document_types",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("code", sa.String(length=100), nullable=False),
        sa.Column("label", sa.String(length=255), nullable=False),
        sa.Column("description", sa.String(length=512), nullable=True),
        sa.Column("display_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("code"),
    )
    op.create_index(op.f("ix_submission_document_types_id"), "submission_document_types", ["id"], unique=False)
    op.create_index(op.f("ix_submission_document_types_code"), "submission_document_types", ["code"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_submission_document_types_code"), table_name="submission_document_types")
    op.drop_index(op.f("ix_submission_document_types_id"), table_name="submission_document_types")
    op.drop_table("submission_document_types")
