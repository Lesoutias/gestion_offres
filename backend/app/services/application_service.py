from typing import Optional

from sqlalchemy.orm import Session

from ..models.application import Application
from ..models.application_document import ApplicationDocument
from ..schemas.application_schema import ApplicationCreate, ApplicationUpdate


def create_application(db: Session, application_data: ApplicationCreate, candidate_id: int):
    db_application = Application(
        job_offer_id=application_data.job_offer_id,
        cover_letter=application_data.cover_letter,
        candidate_id=candidate_id,
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


def list_candidate_applications(db: Session, candidate_id: int):
    return db.query(Application).filter(Application.candidate_id == candidate_id).all()


def list_recruiter_applications(db: Session, recruiter_id: Optional[int] = None):
    query = db.query(Application).join(Application.job_offer)
    if recruiter_id is not None:
        query = query.filter(Application.job_offer.has(recruiter_id=recruiter_id))
    return query.all()


def list_all_applications(db: Session, status: Optional[str] = None):
    query = db.query(Application)
    if status:
        query = query.filter(Application.status == status)
    return query.all()


def get_application(db: Session, application_id: int):
    return db.query(Application).filter(Application.id == application_id).first()


def update_application_status(db: Session, application_id: int, status: str, recruiter_id: Optional[int] = None):
    query = db.query(Application).filter(Application.id == application_id)
    
    application = query.first()
    if not application:
        return None

    # Vérifier que le recruteur a le droit de modifier
    if recruiter_id is not None:
        if application.job_offer.recruiter_id != recruiter_id:
            return None

    application.status = status
    db.commit()
    db.refresh(application)
    return application


def add_document(
    db: Session,
    application_id: int,
    document_type: str,
    file_url: str,
    file_name: str,
    file_mime_type: str,
):
    document = ApplicationDocument(
        application_id=application_id,
        document_type=document_type,
        file_url=file_url,
        file_name=file_name,
        file_mime_type=file_mime_type,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


def get_application_documents(db: Session, application_id: int):
    return db.query(ApplicationDocument).filter(ApplicationDocument.application_id == application_id).all()


def delete_document(db: Session, document_id: int):
    document = db.query(ApplicationDocument).filter(ApplicationDocument.id == document_id).first()
    if not document:
        return False
    db.delete(document)
    db.commit()
    return True


def delete_application(db: Session, application_id: int):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        return False
    db.delete(application)
    db.commit()
    return True
