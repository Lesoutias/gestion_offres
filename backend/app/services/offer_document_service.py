from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.offer_document import OfferDocument
from ..schemas.offer_document_schema import OfferDocumentCreate, OfferDocumentUpdate


def create_offer_document(db: Session, data: OfferDocumentCreate) -> OfferDocument:
    document = OfferDocument(**data.model_dump())
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


def list_offer_documents(db: Session, offer_id: int) -> list[OfferDocument]:
    return db.query(OfferDocument).filter(OfferDocument.offer_id == offer_id).order_by(OfferDocument.uploaded_at.desc()).all()


def get_offer_document(db: Session, document_id: int) -> OfferDocument:
    document = db.query(OfferDocument).filter(OfferDocument.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document introuvable")
    return document


def update_offer_document(db: Session, document_id: int, data: OfferDocumentUpdate) -> OfferDocument:
    document = get_offer_document(db, document_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(document, field, value)
    db.commit()
    db.refresh(document)
    return document


def delete_offer_document(db: Session, document_id: int) -> None:
    document = get_offer_document(db, document_id)
    db.delete(document)
    db.commit()
