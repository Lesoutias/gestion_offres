from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.public_authority import PublicAuthority
from ..models.user import User
from ..schemas.dashboard_schema import AdminDashboardStats, AuthorityDashboardStats, CompanyDashboardStats
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, ENTREPRISE, MAIRIE_ROLES, require_roles
from ..services import company_service, dashboard_service
from .auth_routes import get_current_user

router = APIRouter()


def _resolve_authority_id(db: Session, user: User) -> int:
    if user.public_authority_profile:
        return user.public_authority_profile.id
    authority = db.query(PublicAuthority).order_by(PublicAuthority.id).first()
    return authority.id if authority else 0


@router.get("/admin/stats", response_model=AdminDashboardStats)
def admin_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, MAIRIE_ROLES)
    return dashboard_service.get_admin_stats(db)


@router.get("/authority/stats", response_model=AuthorityDashboardStats)
def authority_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, MAIRIE_ROLES)
    authority_id = _resolve_authority_id(db, current_user)
    return dashboard_service.get_authority_stats(db, authority_id)


@router.get("/company/stats", response_model=CompanyDashboardStats)
def company_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ENTREPRISE])
    company = company_service.get_my_company(db, current_user.id)
    return dashboard_service.get_company_stats(db, company.id)
