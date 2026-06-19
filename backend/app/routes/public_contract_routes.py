from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.public_contract_schema import PublicContractCreate, PublicContractRead
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, ENTREPRISE, MAIRIE_ROLES, require_roles
from ..services import company_service, public_contract_service
from ..services.audit_log_service import log_action
from .auth_routes import get_current_user

router = APIRouter()


@router.post("", response_model=PublicContractRead)
def create_public_contract(
    data: PublicContractCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    public_contract = public_contract_service.create_public_contract(db, data)
    log_action(db, current_user.id, "public_contract.create", "PublicContract", public_contract.id)
    return public_contract


@router.get("", response_model=List[PublicContractRead])
def list_public_contracts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return public_contract_service.list_public_contracts(db)


@router.get("/me", response_model=List[PublicContractRead])
def get_my_public_contracts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ENTREPRISE])
    company = company_service.get_my_company(db, current_user.id)
    return public_contract_service.list_company_public_contracts(db, company.id)


@router.get("/{public_contract_id}", response_model=PublicContractRead)
def get_public_contract(public_contract_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    public_contract = public_contract_service.get_public_contract(db, public_contract_id)
    if current_user.role.name == ENTREPRISE:
        company = company_service.get_my_company(db, current_user.id)
        if public_contract.company_id != company.id:
            require_roles(current_user, MAIRIE_ROLES)
    else:
        require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return public_contract


@router.patch("/{public_contract_id}/sign", response_model=PublicContractRead)
def sign_public_contract(public_contract_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    public_contract = public_contract_service.sign_public_contract(db, public_contract_id)
    log_action(db, current_user.id, "public_contract.sign", "PublicContract", public_contract.id)
    return public_contract


@router.patch("/{public_contract_id}/cancel", response_model=PublicContractRead)
def cancel_public_contract(public_contract_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    public_contract = public_contract_service.cancel_public_contract(db, public_contract_id)
    log_action(db, current_user.id, "public_contract.cancel", "PublicContract", public_contract.id)
    return public_contract
