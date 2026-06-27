from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.offer_document import OfferDocument
from ..models.dao_document import DaoDocument
from ..models.offer import Offer
from ..models.submission_document_type import SubmissionDocumentType
from ..schemas.offer_document_schema import OfferDocumentCreate, OfferDocumentUpdate


def ensure_document_can_be_uploaded(db: Session, offer_id: int, document_type: str) -> Offer:
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre introuvable")
    if offer.statut != "draft":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cette offre a deja ete soumise")
    tender = offer.tender_call
    deadline = tender.date_limite
    if deadline.tzinfo is None:
        deadline = deadline.replace(tzinfo=timezone.utc)
    if tender.statut != "published" or deadline <= datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Les soumissions sont fermees pour cet appel d'offres")
    dao = db.query(DaoDocument).filter(DaoDocument.tender_call_id == tender.id).first()
    required_types = set(dao.required_document_types or []) if dao else set()
    if document_type not in required_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce document n'est pas exige par le DAO de cet appel d'offres",
        )
    return offer


def create_offer_document(db: Session, data: OfferDocumentCreate) -> OfferDocument:
    valid_type = (
        db.query(SubmissionDocumentType)
        .filter(
            SubmissionDocumentType.code == data.document_type,
            SubmissionDocumentType.is_active.is_(True),
        )
        .first()
    )
    if not valid_type:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Type de document invalide")
    document = (
        db.query(OfferDocument)
        .filter(OfferDocument.offer_id == data.offer_id, OfferDocument.document_type == data.document_type)
        .first()
    )
    if document:
        for field, value in data.model_dump(exclude={"offer_id", "document_type"}).items():
            setattr(document, field, value)
    else:
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
