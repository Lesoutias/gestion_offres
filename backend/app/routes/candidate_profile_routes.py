from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.candidate_profile import CandidateProfile
from ..models.user import User
from ..routes.auth_routes import get_current_user
from ..security.permissions import get_current_candidate
from ..schemas.candidate_profile_schema import (
    CandidateProfileCreate,
    CandidateProfileRead,
    CandidateProfileUpdate,
)

router = APIRouter()


@router.get("/me", response_model=CandidateProfileRead, dependencies=[Depends(get_current_candidate)])
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Récupérer mon profil candidat (candidat uniquement)"""
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        # Créer un profil vierge si inexistant
        profile = CandidateProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return profile


@router.patch("/me", response_model=CandidateProfileRead, dependencies=[Depends(get_current_candidate)])
def update_my_profile(
    profile_data: CandidateProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mettre à jour mon profil candidat (candidat uniquement)"""
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        # Créer un profil vierge si inexistant
        profile = CandidateProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    # Mettre à jour les champs
    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/{user_id}", response_model=CandidateProfileRead)
def get_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Récupérer le profil d'un candidat (recruiter/admin)"""
    if current_user.role.name not in ["recruiter", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profil non trouvé")
    
    return profile
