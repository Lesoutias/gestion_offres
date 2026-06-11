from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.public_authority_schema import (
    DefineNeedRequest,
    PlanTenderRequest,
    PublicAuthorityCreate,
    PublicAuthorityRead,
    PublicAuthorityUpdate,
)
from ..schemas.tender_call_schema import TenderCallRead
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, require_roles
from ..services import public_authority_service
from ..services.audit_log_service import log_action
from .auth_routes import get_current_user

router = APIRouter()


@router.get("", response_model=List[PublicAuthorityRead])
def list_public_authorities(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return public_authority_service.list_public_authorities(db)


@router.get("/{authority_id}", response_model=PublicAuthorityRead)
def get_public_authority(authority_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return public_authority_service.get_public_authority(db, authority_id)


@router.post("", response_model=PublicAuthorityRead)
def create_public_authority(
    data: PublicAuthorityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN])
    authority = public_authority_service.create_public_authority(db, data)
    log_action(db, current_user.id, "public_authority.create", "PublicAuthority", authority.id)
    return authority


@router.put("/{authority_id}", response_model=PublicAuthorityRead)
def update_public_authority(
    authority_id: int,
    data: PublicAuthorityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    authority = public_authority_service.update_public_authority(db, authority_id, data)
    log_action(db, current_user.id, "public_authority.update", "PublicAuthority", authority.id)
    return authority


@router.post("/{authority_id}/define-need")
def define_need(
    authority_id: int,
    data: DefineNeedRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    result = public_authority_service.definir_besoin(db, authority_id, data)
    log_action(db, current_user.id, "public_authority.define_need", "PublicAuthority", authority_id)
    return result


@router.post("/{authority_id}/plan-tender", response_model=TenderCallRead)
def plan_tender(
    authority_id: int,
    data: PlanTenderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    tender = public_authority_service.planifier_appel_offre(db, authority_id, data, current_user.id)
    log_action(db, current_user.id, "public_authority.plan_tender", "TenderCall", tender.id)
    return tender
