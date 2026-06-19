from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.role import Role
from ..models.user import User
from ..schemas.user_schema import UserCreate, UserUpdate
from ..security.password import hash_password


def list_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.created_at.desc()).all()


def get_user(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable")
    return user


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, data: UserCreate) -> User:
    if get_user_by_email(db, data.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email deja utilise")
    if data.role_name == "entreprise":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Utilisez l'inscription entreprise pour creer un compte entreprise",
        )
    role = db.query(Role).filter(Role.name == data.role_name).first()
    if not role:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role invalide")
    user = User(
        email=data.email,
        full_name=data.full_name,
        hashed_password=hash_password(data.password),
        role_id=role.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user_id: int, data: UserUpdate) -> User:
    user = get_user(db, user_id)
    values = data.model_dump(exclude_unset=True)
    role_name = values.pop("role_name", None)
    if role_name:
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role invalide")
        user.role_id = role.id
    for field, value in values.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def activate_user(db: Session, user_id: int) -> User:
    user = get_user(db, user_id)
    user.is_active = True
    db.commit()
    db.refresh(user)
    return user


def deactivate_user(db: Session, user_id: int) -> User:
    user = get_user(db, user_id)
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user
