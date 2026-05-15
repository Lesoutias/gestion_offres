from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.job_offer_review import JobOfferReview
from ..models.user import User
from ..routes.auth_routes import get_current_user
from ..security.permissions import get_current_candidate, get_current_admin, require_role
from ..schemas.job_offer_review_schema import JobOfferReviewCreate, JobOfferReviewRead, JobOfferReviewUpdate

router = APIRouter()


@router.post("/", response_model=JobOfferReviewRead, dependencies=[Depends(get_current_candidate)])
def create_review(
    review_data: JobOfferReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Créer un avis sur une offre d'emploi (candidat uniquement)"""
    # Vérifier que le candidat a postulé à cette offre
    from ..models.application import Application
    application = db.query(Application).filter(
        Application.job_offer_id == review_data.job_offer_id,
        Application.candidate_id == current_user.id,
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous devez postuler à une offre avant de la noter",
        )
    
    review = JobOfferReview(
        job_offer_id=review_data.job_offer_id,
        candidate_id=current_user.id,
        rating=review_data.rating,
        comment=review_data.comment,
        is_report=review_data.is_report,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("/admin", response_model=List[JobOfferReviewRead], dependencies=[Depends(get_current_admin)])
def get_admin_reviews(
    db: Session = Depends(get_db),
):
    """Lister tous les avis (admin uniquement)"""
    return db.query(JobOfferReview).all()


@router.get("/reports", response_model=List[JobOfferReviewRead], dependencies=[Depends(get_current_admin)])
def get_reports(
    db: Session = Depends(get_db),
):
    """Lister les signalements (admin uniquement)"""
    return db.query(JobOfferReview).filter(JobOfferReview.is_report == True).all()


@router.patch("/{review_id}", response_model=JobOfferReviewRead, dependencies=[Depends(require_role("candidate", "admin"))])
def update_review(
    review_id: int,
    review_data: JobOfferReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mettre à jour un avis (candidat/admin)"""
    review = db.query(JobOfferReview).filter(JobOfferReview.id == review_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Avis non trouvé")
    
    # Vérifier les droits
    if current_user.role.name == "candidate" and review.candidate_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    if review_data.rating is not None:
        review.rating = review_data.rating
    if review_data.comment is not None:
        review.comment = review_data.comment
    if review_data.is_report is not None:
        review.is_report = review_data.is_report
    
    db.commit()
    db.refresh(review)
    return review


@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Supprimer un avis"""
    review = db.query(JobOfferReview).filter(JobOfferReview.id == review_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Avis non trouvé")
    
    # Vérifier les droits
    if current_user.role.name == "candidate" and review.candidate_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    if current_user.role.name not in ["candidate", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    db.delete(review)
    db.commit()
    return {"detail": "Avis supprimé"}
