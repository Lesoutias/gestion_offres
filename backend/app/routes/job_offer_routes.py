from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas.job_offer_schema import JobOfferCreate, JobOfferRead, JobOfferAdminRead, JobOfferUpdate
from ..services.job_offer_service import (
    create_job_offer,
    list_job_offers,
    get_job_offer,
    list_all_job_offers,
    publish_job_offer,
    reject_job_offer,
    close_job_offer,
    update_job_offer,
    delete_job_offer,
)
from ..models.user import User
from ..routes.auth_routes import get_current_user
from ..security.permissions import (
    get_current_admin,
    get_current_recruiter,
    require_role,
)

router = APIRouter()


@router.post("/", response_model=JobOfferRead, dependencies=[Depends(require_role("recruiter", "admin"))])
def create_offer(
    job_offer: JobOfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Créer une nouvelle offre d'emploi (recruteur/admin)"""
    status_offer = "published" if current_user.role.name == "admin" else "pending"
    return create_job_offer(
        db,
        job_offer,
        recruiter_id=current_user.id,
        status=status_offer,
    )


@router.get("/", response_model=List[JobOfferRead])
def get_offers(db: Session = Depends(get_db)):
    """Lister les offres publiées"""
    return list_job_offers(db)


@router.get("/admin/pending", response_model=List[JobOfferAdminRead], dependencies=[Depends(get_current_admin)])
def get_pending_offers(
    db: Session = Depends(get_db),
):
    """Lister les offres en attente de validation (admin uniquement)"""
    from ..models.job_offer import JobOffer
    return db.query(JobOffer).filter(JobOffer.status == "pending").all()


@router.get("/recruiter/me", response_model=List[JobOfferRead], dependencies=[Depends(get_current_recruiter)])
def get_recruiter_offers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lister les offres du recruteur connecté (recruteur/admin)"""
    from ..models.job_offer import JobOffer
    return db.query(JobOffer).filter(JobOffer.recruiter_id == current_user.id).all()


@router.get("/admin/all", response_model=List[JobOfferAdminRead], dependencies=[Depends(get_current_admin)])
def get_admin_all_offers(
    db: Session = Depends(get_db),
):
    """Lister toutes les offres (admin uniquement)"""
    return list_all_job_offers(db)


@router.get("/{offer_id}", response_model=JobOfferRead)
def get_offer(offer_id: int, db: Session = Depends(get_db)):
    """Récupérer les détails d'une offre"""
    offer = get_job_offer(db, offer_id, published_only=True)
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre non trouvée")
    return offer


@router.patch("/{offer_id}", response_model=JobOfferRead)
def update_offer(
    offer_id: int,
    offer_data: JobOfferUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mettre à jour une offre"""
    from ..models.job_offer import JobOffer
    offer = db.query(JobOffer).filter(JobOffer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre non trouvée")
    
    # Vérifier les droits
    if current_user.role.name == "recruiter" and offer.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    return update_job_offer(db, offer_id, offer_data)


@router.patch("/{offer_id}/publish", response_model=JobOfferRead, dependencies=[Depends(get_current_admin)])
def publish_offer(
    offer_id: int,
    db: Session = Depends(get_db),
):
    """Publier une offre (admin uniquement)"""
    offer = publish_job_offer(db, offer_id)
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre non trouvée")
    return offer


@router.patch("/{offer_id}/reject", response_model=JobOfferRead, dependencies=[Depends(get_current_admin)])
def reject_offer(
    offer_id: int,
    db: Session = Depends(get_db),
):
    """Rejeter une offre (admin uniquement)"""
    offer = reject_job_offer(db, offer_id)
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre non trouvée")
    return offer


@router.patch("/{offer_id}/close", response_model=JobOfferRead, dependencies=[Depends(require_role("recruiter", "admin"))])
def close_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fermer une offre (recruteur/admin)"""
    from ..models.job_offer import JobOffer
    offer = db.query(JobOffer).filter(JobOffer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre non trouvée")
    
    # Vérifier les droits
    if current_user.role.name == "recruiter" and offer.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")

    offer = close_job_offer(db, offer_id)
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre non trouvée")
    return offer


@router.delete("/{offer_id}", dependencies=[Depends(require_role("recruiter", "admin"))])
def delete_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Supprimer une offre (recruteur/admin)"""
    from ..models.job_offer import JobOffer
    offer = db.query(JobOffer).filter(JobOffer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre non trouvée")
    
    # Vérifier les droits
    if current_user.role.name == "recruiter" and offer.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")

    if delete_job_offer(db, offer_id):
        return {"detail": "Offre supprimée"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre non trouvée")
