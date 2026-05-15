from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.user import User
from ..schemas.user_schema import UserRead
from ..routes.auth_routes import get_current_user
from ..security.permissions import get_current_admin

router = APIRouter()


@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(get_current_user)):
    return UserRead(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        role_name=current_user.role.name,
    )


@router.get("/", response_model=List[UserRead], dependencies=[Depends(get_current_admin)])
def list_users(db: Session = Depends(get_db)):
    """Lister tous les utilisateurs (admin uniquement)"""
    users = db.query(User).all()
    return [
        UserRead(
            id=u.id,
            email=u.email,
            full_name=u.full_name,
            is_active=u.is_active,
            role_name=u.role.name,
        )
        for u in users
    ]
