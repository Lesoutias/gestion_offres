from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.audit_log_schema import AuditLogRead
from ..security.permissions import ADMIN, require_roles
from ..services import audit_log_service
from .auth_routes import get_current_user

router = APIRouter()


@router.get("", response_model=List[AuditLogRead])
def list_audit_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN])
    return audit_log_service.list_audit_logs(db, skip, limit)


@router.get("/user/{user_id}", response_model=List[AuditLogRead])
def list_user_audit_logs(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN])
    return audit_log_service.list_user_audit_logs(db, user_id, skip, limit)
