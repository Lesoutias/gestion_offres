from typing import List

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.permission_schema import PermissionCreate, PermissionRead, PermissionUpdate
from ..security.permissions import ADMIN, require_roles
from ..services import permission_service
from ..services.audit_log_service import log_action
from .auth_routes import get_current_user

router = APIRouter()


@router.get("", response_model=List[PermissionRead])
def list_permissions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN])
    return permission_service.list_permissions(db)


@router.post("", response_model=PermissionRead)
def create_permission(data: PermissionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN])
    permission = permission_service.create_permission(db, data)
    log_action(db, current_user.id, "permission.create", "Permission", permission.id)
    return permission


@router.put("/{permission_id}", response_model=PermissionRead)
def update_permission(
    permission_id: int,
    data: PermissionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN])
    permission = permission_service.update_permission(db, permission_id, data)
    log_action(db, current_user.id, "permission.update", "Permission", permission.id)
    return permission


@router.delete("/{permission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_permission(permission_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN])
    permission_service.delete_permission(db, permission_id)
    log_action(db, current_user.id, "permission.delete", "Permission", permission_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
