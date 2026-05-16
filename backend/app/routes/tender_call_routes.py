from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.tender_call_schema import TenderCallCreate, TenderCallRead, TenderCallUpdate
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, require_roles
from ..services import tender_call_service
from ..services.audit_log_service import log_action
from .auth_routes import get_current_user

router = APIRouter()


@router.post("/", response_model=TenderCallRead)
def create_tender_call(
    data: TenderCallCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    if data.published_by_id is None:
        data.published_by_id = current_user.id
    tender = tender_call_service.create_tender_call(db, data)
    log_action(db, current_user.id, "tender.create", "TenderCall", tender.id)
    return tender


@router.get("/", response_model=List[TenderCallRead])
def list_tender_calls(db: Session = Depends(get_db)):
    return tender_call_service.list_published_tender_calls(db)


@router.get("/published", response_model=List[TenderCallRead])
def list_published_tender_calls(db: Session = Depends(get_db)):
    return tender_call_service.list_published_tender_calls(db)


@router.get("/admin", response_model=List[TenderCallRead])
def list_all_tender_calls(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return tender_call_service.list_tender_calls(db)


@router.get("/{tender_call_id}", response_model=TenderCallRead)
def get_tender_call(tender_call_id: int, db: Session = Depends(get_db)):
    tender = tender_call_service.get_tender_call(db, tender_call_id)
    if tender.statut != "published":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appel d'offres introuvable")
    return tender


@router.put("/{tender_call_id}", response_model=TenderCallRead)
def update_tender_call(
    tender_call_id: int,
    data: TenderCallUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    tender = tender_call_service.update_tender_call(db, tender_call_id, data)
    log_action(db, current_user.id, "tender.update", "TenderCall", tender.id)
    return tender


@router.patch("/{tender_call_id}/publish", response_model=TenderCallRead)
def publish_tender_call(tender_call_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    tender = tender_call_service.publish_tender_call(db, tender_call_id, current_user.id)
    log_action(db, current_user.id, "tender.publish", "TenderCall", tender.id)
    return tender


@router.patch("/{tender_call_id}/close", response_model=TenderCallRead)
def close_tender_call(tender_call_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    tender = tender_call_service.close_tender_call(db, tender_call_id)
    log_action(db, current_user.id, "tender.close", "TenderCall", tender.id)
    return tender


@router.patch("/{tender_call_id}/cancel", response_model=TenderCallRead)
def cancel_tender_call(tender_call_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    tender = tender_call_service.cancel_tender_call(db, tender_call_id)
    log_action(db, current_user.id, "tender.cancel", "TenderCall", tender.id)
    return tender


@router.patch("/{tender_call_id}/start-evaluation", response_model=TenderCallRead)
def start_evaluation(tender_call_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    tender = tender_call_service.start_evaluation(db, tender_call_id)
    log_action(db, current_user.id, "tender.start_evaluation", "TenderCall", tender.id)
    return tender
