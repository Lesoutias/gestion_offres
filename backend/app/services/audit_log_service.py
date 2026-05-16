from sqlalchemy.orm import Session

from ..models.audit_log import AuditLog
from ..schemas.audit_log_schema import AuditLogCreate


def create_audit_log(db: Session, data: AuditLogCreate) -> AuditLog:
    log = AuditLog(**data.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def log_action(
    db: Session,
    user_id: int | None,
    action: str,
    entity_type: str | None = None,
    entity_id: int | str | None = None,
    description: str | None = None,
) -> AuditLog:
    return create_audit_log(
        db,
        AuditLogCreate(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id) if entity_id is not None else None,
            description=description,
        ),
    )


def list_audit_logs(db: Session, skip: int = 0, limit: int = 100) -> list[AuditLog]:
    return (
        db.query(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def list_user_audit_logs(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list[AuditLog]:
    return (
        db.query(AuditLog)
        .filter(AuditLog.user_id == user_id)
        .order_by(AuditLog.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
