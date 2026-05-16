from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.permission import Permission
from ..schemas.permission_schema import PermissionCreate, PermissionUpdate


def list_permissions(db: Session) -> list[Permission]:
    return db.query(Permission).order_by(Permission.name.asc()).all()


def get_permission(db: Session, permission_id: int) -> Permission:
    permission = db.query(Permission).filter(Permission.id == permission_id).first()
    if not permission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission introuvable")
    return permission


def create_permission(db: Session, data: PermissionCreate) -> Permission:
    existing = db.query(Permission).filter(Permission.name == data.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Permission deja existante")
    permission = Permission(**data.model_dump())
    db.add(permission)
    db.commit()
    db.refresh(permission)
    return permission


def update_permission(db: Session, permission_id: int, data: PermissionUpdate) -> Permission:
    permission = get_permission(db, permission_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(permission, field, value)
    db.commit()
    db.refresh(permission)
    return permission


def delete_permission(db: Session, permission_id: int) -> None:
    permission = get_permission(db, permission_id)
    db.delete(permission)
    db.commit()
