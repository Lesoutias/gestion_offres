from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.offer_document_schema import OfferDocumentRead, OfferDocumentType
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION, ENTREPRISE, require_roles
from ..services import company_service, offer_document_service, offer_service
from ..services.audit_log_service import log_action
from ..services.file_upload_service import FileUploadService
from .auth_routes import get_current_user

router = APIRouter()


def _ensure_offer_owner_or_reader(db: Session, offer_id: int, current_user: User) -> None:
    offer = offer_service.get_offer(db, offer_id)
    if current_user.role.name == ENTREPRISE:
        company = company_service.get_my_company(db, current_user.id)
        if offer.company_id != company.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acces refuse")
    else:
        require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION])


@router.post("/offer/{offer_id}/upload", response_model=OfferDocumentRead)
async def upload_offer_document(
    offer_id: int,
    document_type: OfferDocumentType,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ENTREPRISE])
    _ensure_offer_owner_or_reader(db, offer_id, current_user)
    saved = await FileUploadService.save_upload(file, "offers")
    from ..schemas.offer_document_schema import OfferDocumentCreate

    document = offer_document_service.create_offer_document(
        db,
        OfferDocumentCreate(offer_id=offer_id, document_type=document_type, **saved),
    )
    log_action(db, current_user.id, "offer_document.upload", "OfferDocument", document.id)
    return document


@router.get("/offer/{offer_id}", response_model=List[OfferDocumentRead])
def list_offer_documents(offer_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _ensure_offer_owner_or_reader(db, offer_id, current_user)
    return offer_document_service.list_offer_documents(db, offer_id)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_offer_document(document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ENTREPRISE])
    document = offer_document_service.get_offer_document(db, document_id)
    _ensure_offer_owner_or_reader(db, document.offer_id, current_user)
    offer_document_service.delete_offer_document(db, document_id)
    log_action(db, current_user.id, "offer_document.delete", "OfferDocument", document_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
