from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.dao_document import DaoDocument
from ..models.submission_document_type import SubmissionDocumentType
from ..schemas.dao_document_schema import DaoDocumentCreate, DaoDocumentUpdate


def list_submission_document_types(db: Session) -> list[SubmissionDocumentType]:
    return (
        db.query(SubmissionDocumentType)
        .filter(SubmissionDocumentType.is_active.is_(True))
        .order_by(SubmissionDocumentType.display_order, SubmissionDocumentType.label)
        .all()
    )


def validate_required_document_types(db: Session, document_types: list[str]) -> list[str]:
    unique_types = list(dict.fromkeys(document_types))
    if not unique_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selectionnez au moins un document obligatoire pour le DAO",
        )
    valid_codes = {
        row.code
        for row in db.query(SubmissionDocumentType)
        .filter(SubmissionDocumentType.code.in_(unique_types), SubmissionDocumentType.is_active.is_(True))
        .all()
    }
    unknown = [code for code in unique_types if code not in valid_codes]
    if unknown:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Types de documents invalides: {', '.join(unknown)}",
        )
    return unique_types


def create_dao_document(db: Session, data: DaoDocumentCreate) -> DaoDocument:
    existing = db.query(DaoDocument).filter(DaoDocument.tender_call_id == data.tender_call_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="DAO deja cree pour cet appel d'offres")
    payload = data.model_dump()
    payload["required_document_types"] = validate_required_document_types(db, payload["required_document_types"])
    dao = DaoDocument(**payload)
    db.add(dao)
    db.commit()
    db.refresh(dao)
    return dao


def get_dao_document(db: Session, dao_id: int) -> DaoDocument:
    dao = db.query(DaoDocument).filter(DaoDocument.id == dao_id).first()
    if not dao:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dossier DAO introuvable")
    return dao


def get_dao_by_tender(db: Session, tender_call_id: int) -> DaoDocument:
    dao = db.query(DaoDocument).filter(DaoDocument.tender_call_id == tender_call_id).first()
    if not dao:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dossier DAO introuvable")
    return dao


def update_dao_document(db: Session, dao_id: int, data: DaoDocumentUpdate) -> DaoDocument:
    dao = get_dao_document(db, dao_id)
    payload = data.model_dump(exclude_unset=True)
    if "required_document_types" in payload:
        payload["required_document_types"] = validate_required_document_types(db, payload["required_document_types"])
    for field, value in payload.items():
        setattr(dao, field, value)
    db.commit()
    db.refresh(dao)
    return dao


def attach_dao_file(db: Session, dao_id: int, document_url: str) -> DaoDocument:
    dao = get_dao_document(db, dao_id)
    dao.document_url = document_url
    db.commit()
    db.refresh(dao)
    return dao
