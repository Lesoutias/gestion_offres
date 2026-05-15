from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from ..models.job_offer import JobOffer
from ..models.application import Application
from ..models.user import User
from ..models.job_offer_review import JobOfferReview
from ..routes.auth_routes import get_current_user

router = APIRouter()


@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtenir les statistiques du système (admin)"""
    if current_user.role.name != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    # Statistiques des offres
    total_offers = db.query(func.count(JobOffer.id)).scalar()
    published_offers = db.query(func.count(JobOffer.id)).filter(JobOffer.status == "published").scalar()
    pending_offers = db.query(func.count(JobOffer.id)).filter(JobOffer.status == "pending").scalar()
    rejected_offers = db.query(func.count(JobOffer.id)).filter(JobOffer.status == "rejected").scalar()
    closed_offers = db.query(func.count(JobOffer.id)).filter(JobOffer.status == "closed").scalar()
    
    # Statistiques des candidatures
    total_applications = db.query(func.count(Application.id)).scalar()
    pending_applications = db.query(func.count(Application.id)).filter(Application.status == "pending").scalar()
    reviewed_applications = db.query(func.count(Application.id)).filter(Application.status == "reviewed").scalar()
    shortlisted_applications = db.query(func.count(Application.id)).filter(Application.status == "shortlisted").scalar()
    invited_applications = db.query(func.count(Application.id)).filter(Application.status == "invited").scalar()
    accepted_applications = db.query(func.count(Application.id)).filter(Application.status == "accepted").scalar()
    rejected_applications = db.query(func.count(Application.id)).filter(Application.status == "rejected").scalar()
    
    # Statistiques des utilisateurs
    total_users = db.query(func.count(User.id)).scalar()
    candidates = db.query(func.count(User.id)).filter(User.role.has(name="candidate")).scalar()
    recruiters = db.query(func.count(User.id)).filter(User.role.has(name="recruiter")).scalar()
    admins = db.query(func.count(User.id)).filter(User.role.has(name="admin")).scalar()
    
    # Signalements
    total_reports = db.query(func.count(JobOfferReview.id)).filter(JobOfferReview.is_report == True).scalar()
    
    return {
        "job_offers": {
            "total": total_offers,
            "published": published_offers,
            "pending": pending_offers,
            "rejected": rejected_offers,
            "closed": closed_offers,
        },
        "applications": {
            "total": total_applications,
            "pending": pending_applications,
            "reviewed": reviewed_applications,
            "shortlisted": shortlisted_applications,
            "invited": invited_applications,
            "accepted": accepted_applications,
            "rejected": rejected_applications,
        },
        "users": {
            "total": total_users,
            "candidates": candidates,
            "recruiters": recruiters,
            "admins": admins,
        },
        "reports": total_reports,
    }


@router.get("/pipeline-overview")
def get_pipeline_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtenir un aperçu du pipeline des offres (admin)"""
    if current_user.role.name != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    total_offers = db.query(func.count(JobOffer.id)).scalar()
    
    published = db.query(func.count(JobOffer.id)).filter(JobOffer.status == "published").scalar()
    pending = db.query(func.count(JobOffer.id)).filter(JobOffer.status == "pending").scalar()
    rejected = db.query(func.count(JobOffer.id)).filter(JobOffer.status == "rejected").scalar()
    
    published_pct = (published / total_offers * 100) if total_offers > 0 else 0
    pending_pct = (pending / total_offers * 100) if total_offers > 0 else 0
    rejected_pct = (rejected / total_offers * 100) if total_offers > 0 else 0
    
    return {
        "total": total_offers,
        "published": {
            "count": published,
            "percentage": round(published_pct, 2),
        },
        "pending": {
            "count": pending,
            "percentage": round(pending_pct, 2),
        },
        "rejected": {
            "count": rejected,
            "percentage": round(rejected_pct, 2),
        },
        "status": "up_to_date",
    }
