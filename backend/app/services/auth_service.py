from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from ..models.user import User
from ..models.role import Role
from ..schemas.auth_schema import TokenData
from ..security.password import verify_password, hash_password
from ..security.jwt import create_access_token
from ..schemas.user_schema import UserCreate


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Utilisateur inactif. Contactez l'administrateur.",
        )
    return user


def create_user(db: Session, user_data: UserCreate) -> User:
    hashed_password = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        is_active=user_data.is_active,  # Allow setting is_active
        role_id=user_data.role_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_tokens(user: User):
    payload = {
        "sub": user.email,
        "role": user.role.name,
        "user_id": user.id,
    }
    token = create_access_token(payload)
    return {"access_token": token, "token_type": "bearer"}
