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
    return user


def create_user(db: Session, user_data: UserCreate):
    role = db.query(Role).filter(Role.name == user_data.role_name).first()
    if not role:
        role = Role(name=user_data.role_name, description=f"Rôle {user_data.role_name}")
        db.add(role)
        db.commit()
        db.refresh(role)

    db_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hash_password(user_data.password),
        role_id=role.id,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_tokens(user: User):
    payload = {
        "sub": user.email,
        "role": user.role.name,
        "user_id": user.id,
    }
    token = create_access_token(payload)
    return {"access_token": token, "token_type": "bearer"}
