from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.tender_call import TenderCall
from ..schemas.tender_call_schema import TenderCallCreate, TenderCallUpdate


def _now() -> datetime:
    return datetime.now(timezone.utc)


def list_tender_calls(db: Session) -> list[TenderCall]:
    return db.query(TenderCall).order_by(TenderCall.created_at.desc()).all()


def list_published_tender_calls(db: Session) -> list[TenderCall]:
    return (
        db.query(TenderCall)
        .filter(TenderCall.statut == "published")
        .order_by(TenderCall.date_publication.desc())
        .all()
    )


def list_tender_calls_for_evaluation(db: Session) -> list[TenderCall]:
    return (
        db.query(TenderCall)
        .filter(TenderCall.statut == "evaluation")
        .order_by(TenderCall.created_at.desc())
        .all()
    )


def get_tender_call(db: Session, tender_call_id: int) -> TenderCall:
    tender = db.query(TenderCall).filter(TenderCall.id == tender_call_id).first()
    if not tender:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appel d'offres introuvable")
    return tender


def generate_reference(db: Session) -> str:
    year = _now().year
    prefix = f"AO-{year}-"
    references = (
        db.query(TenderCall.reference)
        .filter(TenderCall.reference.like(f"{prefix}%"))
        .all()
    )
    max_seq = 0
    for (reference,) in references:
        suffix = reference.removeprefix(prefix)
        if suffix.isdigit():
            max_seq = max(max_seq, int(suffix))
    return f"{prefix}{max_seq + 1:04d}"


def create_tender_call(db: Session, data: TenderCallCreate) -> TenderCall:
    payload = data.model_dump()
    reference = payload.get("reference") or generate_reference(db)
    existing = db.query(TenderCall).filter(TenderCall.reference == reference).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reference deja utilisee")
    payload["reference"] = reference
    tender = TenderCall(**payload)
    db.add(tender)
    db.commit()
    db.refresh(tender)
    return tender


def update_tender_call(db: Session, tender_call_id: int, data: TenderCallUpdate) -> TenderCall:
    tender = get_tender_call(db, tender_call_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(tender, field, value)
    db.commit()
    db.refresh(tender)
    return tender


def publish_tender_call(db: Session, tender_call_id: int, published_by_id: int) -> TenderCall:
    tender = get_tender_call(db, tender_call_id)
    if tender.statut != "draft":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Seul un brouillon peut etre publie")
    if tender.date_limite <= _now():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Date limite deja depassee")
    tender.statut = "published"
    tender.date_publication = _now()
    tender.published_by_id = published_by_id
    db.commit()
    db.refresh(tender)
    return tender


def close_tender_call(db: Session, tender_call_id: int) -> TenderCall:
    tender = get_tender_call(db, tender_call_id)
    if tender.statut not in ["published", "evaluation"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Appel d'offres non cloturable")
    tender.statut = "closed"
    db.commit()
    db.refresh(tender)
    return tender


def cancel_tender_call(db: Session, tender_call_id: int) -> TenderCall:
    tender = get_tender_call(db, tender_call_id)
    if tender.statut == "awarded":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Marche deja attribue")
    tender.statut = "cancelled"
    db.commit()
    db.refresh(tender)
    return tender


def start_evaluation(db: Session, tender_call_id: int) -> TenderCall:
    tender = get_tender_call(db, tender_call_id)
    if tender.statut not in ["published", "closed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seul un appel publie ou cloture peut etre mis en evaluation",
        )
    if tender.statut == "published" and tender.date_limite > _now():
        tender.statut = "closed"
    tender.statut = "evaluation"
    db.commit()
    db.refresh(tender)
    return tender
