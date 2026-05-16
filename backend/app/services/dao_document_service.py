from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.dao_document import DaoDocument
from ..schemas.dao_document_schema import DaoDocumentCreate, DaoDocumentUpdate


def create_dao_document(db: Session, data: DaoDocumentCreate) -> DaoDocument:
    existing = db.query(DaoDocument).filter(DaoDocument.tender_call_id == data.tender_call_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="DAO deja cree pour cet appel d'offres")
    dao = DaoDocument(**data.model_dump())
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
    for field, value in data.model_dump(exclude_unset=True).items():
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
