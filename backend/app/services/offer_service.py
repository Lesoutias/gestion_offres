from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.dao_document import DaoDocument
from ..models.offer import Offer
from ..models.public_contract import PublicContract
from ..models.tender_call import TenderCall
from ..schemas.offer_schema import OfferCreate, OfferStatusUpdate, OfferUpdate


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _ensure_comparable(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def submit_offer(db: Session, data: OfferCreate, submitted_by_id: int) -> Offer:
    tender = db.query(TenderCall).filter(TenderCall.id == data.tender_call_id).first()
    if not tender:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appel d'offres introuvable")
    if tender.statut != "published":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Appel d'offres non publie")
    if _ensure_comparable(tender.date_limite) <= _now():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Date limite de soumission depassee")

    duplicate = (
        db.query(Offer)
        .filter(Offer.tender_call_id == data.tender_call_id, Offer.company_id == data.company_id)
        .first()
    )
    if duplicate:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Une offre existe deja pour cet appel d'offres")

    offer = Offer(**data.model_dump(), submitted_by_id=submitted_by_id)
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer


def list_my_offers(db: Session, company_id: int) -> list[Offer]:
    return db.query(Offer).filter(Offer.company_id == company_id).order_by(Offer.created_at.desc()).all()


def list_offers_by_tender(db: Session, tender_call_id: int) -> list[Offer]:
    return db.query(Offer).filter(Offer.tender_call_id == tender_call_id).order_by(Offer.created_at.desc()).all()


def list_all_offers(db: Session) -> list[Offer]:
    return db.query(Offer).order_by(Offer.created_at.desc()).all()


def get_offer(db: Session, offer_id: int) -> Offer:
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre introuvable")
    return offer


def get_dao_required_document_types(db: Session, tender_call_id: int) -> list[str]:
    dao = db.query(DaoDocument).filter(DaoDocument.tender_call_id == tender_call_id).first()
    if not dao or not dao.required_document_types:
        return []
    return list(dao.required_document_types)


def check_offer_documents(db: Session, offer_id: int) -> dict:
    offer = get_offer(db, offer_id)
    required = get_dao_required_document_types(db, offer.tender_call_id)
    uploaded = {document.document_type for document in offer.documents}
    missing = [document_type for document_type in required if document_type not in uploaded]
    return {
        "valid": len(missing) == 0,
        "required": required,
        "uploaded": sorted(uploaded),
        "missing": missing,
    }


def validate_offer_documents(db: Session, offer_id: int) -> dict:
    result = check_offer_documents(db, offer_id)
    if not result["valid"]:
        missing = ", ".join(result["missing"])
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Documents manquants: {missing}",
        )
    return result


def update_offer(db: Session, offer_id: int, data: OfferUpdate) -> Offer:
    offer = get_offer(db, offer_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(offer, field, value)
    db.commit()
    db.refresh(offer)
    return offer


def update_offer_status(db: Session, offer_id: int, data: OfferStatusUpdate) -> Offer:
    offer = get_offer(db, offer_id)
    offer.statut = data.statut
    db.commit()
    db.refresh(offer)
    return offer


def award_offer(db: Session, offer_id: int) -> PublicContract:
    offer = get_offer(db, offer_id)
    tender = offer.tender_call
    if tender.statut not in ["published", "evaluation", "closed"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="L'appel d'offres n'est pas eligible a l'attribution")
    if offer.statut not in ["submitted", "under_review", "accepted"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Offre non eligible a l'attribution")
    existing = db.query(PublicContract).filter(PublicContract.tender_call_id == offer.tender_call_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Marche deja attribue")

    offer.statut = "awarded"
    (
        db.query(Offer)
        .filter(Offer.tender_call_id == offer.tender_call_id, Offer.id != offer.id)
        .update({"statut": "rejected"}, synchronize_session=False)
    )
    tender.statut = "awarded"
    public_contract = PublicContract(
        tender_call_id=offer.tender_call_id,
        company_id=offer.company_id,
        offer_id=offer.id,
        authority_id=tender.authority_id,
        montant=offer.montant,
        devise=offer.devise,
        statut="awarded",
    )
    db.add(public_contract)
    db.commit()
    db.refresh(public_contract)
    return public_contract
