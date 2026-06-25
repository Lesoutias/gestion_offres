"""add report_exports

Revision ID: c9d4e2f3a5b6
Revises: b8e3f1a2c4d5
Create Date: 2026-06-11 20:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "c9d4e2f3a5b6"
down_revision: Union[str, Sequence[str], None] = "b8e3f1a2c4d5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "report_exports",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("report_type", sa.String(length=50), nullable=False),
        sa.Column("tender_call_id", sa.Integer(), nullable=True),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("file_path", sa.String(length=512), nullable=False),
        sa.Column("generated_by_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["generated_by_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["tender_call_id"], ["tender_calls.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_report_exports_id"), "report_exports", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_report_exports_id"), table_name="report_exports")
    op.drop_table("report_exports")
