from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.permission import Permission
from ..models.role import Role
from ..schemas.role_schema import RoleCreate, RoleUpdate


def list_roles(db: Session) -> list[Role]:
    return db.query(Role).order_by(Role.name.asc()).all()


def get_role(db: Session, role_id: int) -> Role:
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role introuvable")
    return role


def get_role_by_name(db: Session, name: str) -> Role | None:
    return db.query(Role).filter(Role.name == name).first()


def create_role(db: Session, data: RoleCreate) -> Role:
    if get_role_by_name(db, data.name):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role deja existant")
    role = Role(**data.model_dump())
    db.add(role)
    db.commit()
    db.refresh(role)
    return role


def update_role(db: Session, role_id: int, data: RoleUpdate) -> Role:
    role = get_role(db, role_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(role, field, value)
    db.commit()
    db.refresh(role)
    return role


def delete_role(db: Session, role_id: int) -> None:
    role = get_role(db, role_id)
    db.delete(role)
    db.commit()


def assign_permissions(db: Session, role_id: int, permission_ids: list[int]) -> Role:
    role = get_role(db, role_id)
    permissions = db.query(Permission).filter(Permission.id.in_(permission_ids)).all()
    if len(permissions) != len(set(permission_ids)):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Permission invalide")
    role.permissions = permissions
    db.commit()
    db.refresh(role)
    return role
