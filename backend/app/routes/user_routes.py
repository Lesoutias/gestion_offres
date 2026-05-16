from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.user_schema import UserCreate, UserRead, UserUpdate
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, require_roles
from ..services import user_service
from ..services.audit_log_service import log_action
from .auth_routes import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/", response_model=List[UserRead])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return user_service.list_users(db)


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return user_service.get_user(db, user_id)


@router.post("/", response_model=UserRead)
def create_user(data: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN])
    user = user_service.create_user(db, data)
    log_action(db, current_user.id, "user.create", "User", user.id)
    return user


@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN])
    user = user_service.update_user(db, user_id, data)
    log_action(db, current_user.id, "user.update", "User", user.id)
    return user


@router.patch("/{user_id}/activate", response_model=UserRead)
def activate_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN])
    user = user_service.activate_user(db, user_id)
    log_action(db, current_user.id, "user.activate", "User", user.id)
    return user


@router.patch("/{user_id}/deactivate", response_model=UserRead)
def deactivate_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN])
    user = user_service.deactivate_user(db, user_id)
    log_action(db, current_user.id, "user.deactivate", "User", user.id)
    return user
