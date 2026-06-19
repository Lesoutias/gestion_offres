from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.dao_document_schema import DaoDocumentCreate, DaoDocumentRead, DaoDocumentUpdate
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION, ENTREPRISE, require_roles
from ..services import dao_document_service, tender_call_service
from ..services.audit_log_service import log_action
from ..services.file_upload_service import FileUploadService
from .auth_routes import get_current_user

router = APIRouter()


@router.post("", response_model=DaoDocumentRead)
def create_dao_document(data: DaoDocumentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    dao = dao_document_service.create_dao_document(db, data)
    log_action(db, current_user.id, "dao.create", "DaoDocument", dao.id)
    return dao


@router.get("/tender/{tender_call_id}", response_model=DaoDocumentRead)
def get_dao_by_tender(
    tender_call_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tender = tender_call_service.get_tender_call(db, tender_call_id)
    if current_user.role.name == ENTREPRISE:
        if not tender_call_service.company_can_view_tender(tender.statut):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="DAO non disponible")
    elif current_user.role.name not in [ENTREPRISE]:
        require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION])
    return dao_document_service.get_dao_by_tender(db, tender_call_id)


@router.put("/{dao_id}", response_model=DaoDocumentRead)
def update_dao_document(
    dao_id: int,
    data: DaoDocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    dao = dao_document_service.update_dao_document(db, dao_id, data)
    log_action(db, current_user.id, "dao.update", "DaoDocument", dao.id)
    return dao


@router.post("/{dao_id}/upload-file", response_model=DaoDocumentRead)
async def upload_dao_file(
    dao_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    saved = await FileUploadService.save_upload(file, "dao")
    dao = dao_document_service.attach_dao_file(db, dao_id, saved["file_url"])
    log_action(db, current_user.id, "dao.upload", "DaoDocument", dao.id)
    return dao
