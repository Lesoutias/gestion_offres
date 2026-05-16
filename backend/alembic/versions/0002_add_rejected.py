"""Add is_rejected to job_offers

Revision ID: 0002_add_rejected
Revises: 0001_initial
Create Date: 2026-05-14 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

revision = "0002_add_rejected"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "job_offers",
        sa.Column("is_rejected", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.alter_column("job_offers", "is_rejected", server_default=None)


def downgrade():
    op.drop_column("job_offers", "is_rejected")
