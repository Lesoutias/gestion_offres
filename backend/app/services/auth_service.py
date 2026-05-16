from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.company import Company
from ..models.role import Role
from ..models.user import User
from ..schemas.auth_schema import AdminUserCreateRequest, CompanyRegisterRequest
from ..security.jwt import create_access_token
from ..security.password import hash_password, verify_password


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Compte desactive")
    return user


def create_tokens(user: User) -> dict[str, str]:
    payload = {"sub": user.email, "role": user.role.name, "user_id": user.id}
    return {"access_token": create_access_token(payload), "token_type": "bearer"}


def register_company(db: Session, data: CompanyRegisterRequest) -> User:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email deja utilise")

    role = db.query(Role).filter(Role.name == "entreprise").first()
    if not role:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Role entreprise non configure")

    user = User(
        email=data.email,
        full_name=data.full_name,
        hashed_password=hash_password(data.password),
        role_id=role.id,
    )
    db.add(user)
    db.flush()

    company = Company(
        name=data.company_name,
        description=data.company_description,
        address=data.address,
        phone=data.phone,
        email=data.email,
        website=data.website,
        rccm_number=data.rccm_number,
        tax_number=data.tax_number,
        sector=data.sector,
        owner_id=user.id,
    )
    db.add(company)
    db.commit()
    db.refresh(user)
    return user


def create_admin_managed_user(db: Session, data: AdminUserCreateRequest) -> User:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email deja utilise")
    if data.role_name == "entreprise":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Utilisez l'inscription entreprise pour ce role",
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


def create_user(db: Session, user_data):
    """Compatibility wrapper for legacy routes."""
    from ..schemas.auth_schema import CompanyRegisterRequest
    from ..schemas.user_schema import UserCreate

    if isinstance(user_data, UserCreate):
        role = db.query(Role).filter(Role.name == user_data.role_name).first()
        if not role:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role invalide")
        user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hash_password(user_data.password),
            role_id=role.id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    if isinstance(user_data, CompanyRegisterRequest):
        return register_company(db, user_data)
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Donnees invalides")
