from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.contract_schema import ContractCreate, ContractRead, ContractUpdate
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, require_roles
from ..services import contract_service
from ..services.audit_log_service import log_action
from ..services.file_upload_service import FileUploadService
from .auth_routes import get_current_user

router = APIRouter()


@router.post("/", response_model=ContractRead)
def create_contract(data: ContractCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    contract = contract_service.create_contract(db, data)
    log_action(db, current_user.id, "contract.create", "Contract", contract.id)
    return contract


@router.get("/public-contract/{public_contract_id}", response_model=ContractRead)
def get_contract_by_public_contract(
    public_contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return contract_service.get_contract_by_public_contract(db, public_contract_id)


@router.get("/{contract_id}", response_model=ContractRead)
def get_contract(contract_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return contract_service.get_contract(db, contract_id)


@router.put("/{contract_id}", response_model=ContractRead)
def update_contract(
    contract_id: int,
    data: ContractUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    contract = contract_service.update_contract(db, contract_id, data)
    log_action(db, current_user.id, "contract.update", "Contract", contract.id)
    return contract


@router.post("/{contract_id}/upload-file", response_model=ContractRead)
async def upload_contract_file(
    contract_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    saved = await FileUploadService.save_upload(file, "contracts")
    contract = contract_service.attach_contract_file(db, contract_id, saved["file_url"])
    log_action(db, current_user.id, "contract.upload", "Contract", contract.id)
    return contract


@router.patch("/{contract_id}/sign", response_model=ContractRead)
def sign_contract(contract_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    contract = contract_service.sign_contract(db, contract_id)
    log_action(db, current_user.id, "contract.sign", "Contract", contract.id)
    return contract
