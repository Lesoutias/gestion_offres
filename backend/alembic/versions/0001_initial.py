"""Initial migration

Revision ID: 0001_initial
Revises: 
Create Date: 2026-05-13 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
def upgrade():
    op.create_table(
        "roles",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("name", sa.String(50), nullable=False, unique=True),
        sa.Column("description", sa.String(255), nullable=True),
    )
    op.create_table(
        "permissions",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("name", sa.String(100), nullable=False, unique=True),
        sa.Column("description", sa.String(255), nullable=True),
    )
    op.create_table(
        "role_permissions",
        sa.Column("role_id", sa.Integer, sa.ForeignKey("roles.id"), primary_key=True),
        sa.Column("permission_id", sa.Integer, sa.ForeignKey("permissions.id"), primary_key=True),
    )
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("email", sa.String(150), nullable=False, unique=True, index=True),
        sa.Column("full_name", sa.String(150), nullable=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("role_id", sa.Integer, sa.ForeignKey("roles.id"), nullable=False),
    )
    op.create_table(
        "companies",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("owner_id", sa.Integer, sa.ForeignKey("users.id"), nullable=True),
    )
    op.create_table(
        "job_offers",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("location", sa.String(150), nullable=True),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("company_id", sa.Integer, sa.ForeignKey("companies.id"), nullable=False),
        sa.Column("recruiter_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
    )
    op.create_table(
        "applications",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("job_offer_id", sa.Integer, sa.ForeignKey("job_offers.id"), nullable=False),
        sa.Column("candidate_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("cover_letter", sa.Text, nullable=True),
        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),
        sa.Column("resume_url", sa.String(512), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

def downgrade():
    op.drop_table("applications")
    op.drop_table("job_offers")
    op.drop_table("companies")
    op.drop_table("users")
    op.drop_table("role_permissions")
    op.drop_table("permissions")
    op.drop_table("roles")
