from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.job_offer import JobOffer
from ..models.application import Application
from ..schemas.application_schema import (
    ApplicationCreate,
    ApplicationRead,
    ApplicationRecruiterRead,
    ApplicationUpdate,
    ApplicationDetailRead,
)
from ..schemas.application_document_schema import ApplicationDocumentRead
from ..services.application_service import (
    create_application,
    list_candidate_applications,
    list_recruiter_applications,
    list_all_applications,
    get_application,
    update_application_status,
    add_document,
    get_application_documents,
    delete_document,
    delete_application,
)
from ..services.email_service import EmailService
from ..services.file_service import FileService
from ..models.user import User
from ..routes.auth_routes import get_current_user

router = APIRouter()


@router.post("/", response_model=ApplicationRead)
def apply_to_offer(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Postuler à une offre d'emploi"""
    if current_user.role.name != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Seuls les candidats peuvent postuler")

    offer = db.query(JobOffer).filter(
        JobOffer.id == application_data.job_offer_id,
        JobOffer.status == "published",
    ).first()
    if not offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offre introuvable ou non publiée",
        )

    # Vérifier si le candidat a déjà postulé
    existing = db.query(Application).filter(
        Application.job_offer_id == application_data.job_offer_id,
        Application.candidate_id == current_user.id,
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous avez déjà postulé à cette offre",
        )

    return create_application(db, application_data, candidate_id=current_user.id)


@router.get("/me", response_model=List[ApplicationRead])
def my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lister mes candidatures"""
    if current_user.role.name != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    return list_candidate_applications(db, current_user.id)


@router.get("/recruiter", response_model=List[ApplicationRecruiterRead])
def recruiter_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lister les candidatures du recruteur"""
    if current_user.role.name != "recruiter":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    return list_recruiter_applications(db, current_user.id)


@router.get("/admin", response_model=List[ApplicationRecruiterRead])
def admin_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lister toutes les candidatures (admin)"""
    if current_user.role.name != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    return list_all_applications(db)


@router.get("/{application_id}", response_model=ApplicationDetailRead)
def get_application_detail(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Récupérer les détails d'une candidature"""
    application = get_application(db, application_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidature non trouvée")
    
    # Vérifier les droits d'accès
    is_candidate = current_user.role.name == "candidate" and application.candidate_id == current_user.id
    is_recruiter = current_user.role.name == "recruiter" and application.job_offer.recruiter_id == current_user.id
    is_admin = current_user.role.name == "admin"
    
    if not (is_candidate or is_recruiter or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    return application


@router.patch("/{application_id}/status", response_model=ApplicationRead)
def update_app_status(
    application_id: int,
    update: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mettre à jour le statut d'une candidature"""
    if current_user.role.name not in ["recruiter", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")

    recruiter_id = None if current_user.role.name == "admin" else current_user.id
    application = update_application_status(db, application_id, update.status, recruiter_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidature introuvable")

    return application


@router.post("/{application_id}/documents", response_model=ApplicationDocumentRead)
async def upload_document(
    application_id: int,
    document_type: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Ajouter un document à une candidature"""
    application = get_application(db, application_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidature non trouvée")
    
    # Vérifier que c'est le candidat qui ajoute le document
    if application.candidate_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    # Valider et sauvegarder le fichier
    file_info = await FileService.save_file(file, application_id)
    
    # Ajouter le document en base de données
    document = add_document(
        db,
        application_id,
        document_type,
        file_info["file_url"],
        file_info["file_name"],
        file_info["file_mime_type"],
    )
    
    return document


@router.get("/{application_id}/documents", response_model=List[ApplicationDocumentRead])
def get_documents(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lister les documents d'une candidature"""
    application = get_application(db, application_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidature non trouvée")
    
    # Vérifier les droits d'accès
    is_candidate = application.candidate_id == current_user.id
    is_recruiter = application.job_offer.recruiter_id == current_user.id
    is_admin = current_user.role.name == "admin"
    
    if not (is_candidate or is_recruiter or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    return get_application_documents(db, application_id)


@router.post("/{application_id}/invite")
def send_invitation(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Envoyer une invitation à un candidat retenu"""
    if current_user.role.name not in ["recruiter", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    application = get_application(db, application_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidature non trouvée")
    
    # Vérifier les droits
    if current_user.role.name == "recruiter" and application.job_offer.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    # Mettre à jour le statut
    application.status = "invited"
    db.commit()
    
    # Envoyer l'email
    EmailService.send_invitation_email(
        candidate_name=application.candidate.full_name or application.candidate.email,
        candidate_email=application.candidate.email,
        job_offer_title=application.job_offer.title,
        company_name=application.job_offer.company.name,
        db=db,
        sent_by_id=current_user.id,
        application_id=application_id,
    )
    
    return {"detail": "Invitation envoyée"}


@router.delete("/{application_id}")
def delete_app(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Supprimer une candidature"""
    application = get_application(db, application_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidature non trouvée")
    
    # Vérifier les droits
    is_candidate = application.candidate_id == current_user.id
    is_admin = current_user.role.name == "admin"
    
    if not (is_candidate or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    
    if delete_application(db, application_id):
        return {"detail": "Candidature supprimée"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidature non trouvée")
