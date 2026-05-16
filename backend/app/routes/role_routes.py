from typing import List

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.role_schema import RoleCreate, RolePermissionAssign, RoleRead, RoleUpdate
from ..security.permissions import ADMIN, require_roles
from ..services import role_service
from ..services.audit_log_service import log_action
from .auth_routes import get_current_user

router = APIRouter()


@router.get("/", response_model=List[RoleRead])
def list_roles(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN])
    return role_service.list_roles(db)


@router.post("/", response_model=RoleRead)
def create_role(data: RoleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN])
    role = role_service.create_role(db, data)
    log_action(db, current_user.id, "role.create", "Role", role.id)
    return role


@router.put("/{role_id}", response_model=RoleRead)
def update_role(role_id: int, data: RoleUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN])
    role = role_service.update_role(db, role_id, data)
    log_action(db, current_user.id, "role.update", "Role", role.id)
    return role


@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_role(role_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN])
    role_service.delete_role(db, role_id)
    log_action(db, current_user.id, "role.delete", "Role", role_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{role_id}/permissions", response_model=RoleRead)
def assign_permissions(
    role_id: int,
    data: RolePermissionAssign,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN])
    role = role_service.assign_permissions(db, role_id, data.permission_ids)
    log_action(db, current_user.id, "role.assign_permissions", "Role", role.id)
    return role
