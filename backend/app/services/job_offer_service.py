from typing import Optional

from sqlalchemy.orm import Session

from ..models.job_offer import JobOffer
from ..schemas.job_offer_schema import JobOfferCreate, JobOfferUpdate


def create_job_offer(
    db: Session,
    job_offer: JobOfferCreate,
    recruiter_id: int,
    status: str = "pending",
):
    db_offer = JobOffer(
        title=job_offer.title,
        description=job_offer.description,
        location=job_offer.location,
        company_id=job_offer.company_id,
        recruiter_id=recruiter_id,
        status=status,
    )
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)
    return db_offer


def list_job_offers(db: Session):
    return db.query(JobOffer).filter(JobOffer.status == "published").all()


def list_all_job_offers(db: Session, recruiter_id: Optional[int] = None):
    query = db.query(JobOffer)
    if recruiter_id is not None:
        query = query.filter(JobOffer.recruiter_id == recruiter_id)
    return query.all()


def get_job_offer(db: Session, offer_id: int, published_only: bool = True):
    query = db.query(JobOffer).filter(JobOffer.id == offer_id)
    if published_only:
        query = query.filter(JobOffer.status == "published")
    return query.first()


def publish_job_offer(db: Session, offer_id: int):
    offer = db.query(JobOffer).filter(JobOffer.id == offer_id).first()
    if not offer:
        return None
    offer.status = "published"
    db.commit()
    db.refresh(offer)
    return offer


def reject_job_offer(db: Session, offer_id: int):
    offer = db.query(JobOffer).filter(JobOffer.id == offer_id).first()
    if not offer:
        return None
    offer.status = "rejected"
    db.commit()
    db.refresh(offer)
    return offer


def close_job_offer(db: Session, offer_id: int):
    offer = db.query(JobOffer).filter(JobOffer.id == offer_id).first()
    if not offer:
        return None
    offer.status = "closed"
    db.commit()
    db.refresh(offer)
    return offer


def update_job_offer(db: Session, offer_id: int, offer_data: JobOfferUpdate):
    offer = db.query(JobOffer).filter(JobOffer.id == offer_id).first()
    if not offer:
        return None
    
    for field, value in offer_data.dict(exclude_unset=True).items():
        setattr(offer, field, value)
    
    db.commit()
    db.refresh(offer)
    return offer


def delete_job_offer(db: Session, offer_id: int):
    offer = db.query(JobOffer).filter(JobOffer.id == offer_id).first()
    if not offer:
        return False
    db.delete(offer)
    db.commit()
    return True
    return offer


def reject_job_offer(db: Session, offer_id: int):
    offer = db.query(JobOffer).filter(JobOffer.id == offer_id).first()
    if not offer:
        return None
    offer.is_published = False
    offer.is_rejected = True
    db.commit()
    db.refresh(offer)
    return offer
