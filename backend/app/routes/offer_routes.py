from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.offer_schema import OfferCreate, OfferRead, OfferStatusUpdate
from ..schemas.public_contract_schema import PublicContractRead
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION, ENTREPRISE, require_roles
from ..services import company_service, offer_service
from ..services.audit_log_service import log_action
from .auth_routes import get_current_user

router = APIRouter()


@router.post("/", response_model=OfferRead)
def submit_offer(data: OfferCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ENTREPRISE])
    company = company_service.get_my_company(db, current_user.id)
    if data.company_id != company.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Entreprise invalide")
    offer = offer_service.submit_offer(db, data, current_user.id)
    log_action(db, current_user.id, "offer.submit", "Offer", offer.id)
    return offer


@router.get("/me", response_model=List[OfferRead])
def get_my_offers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ENTREPRISE])
    company = company_service.get_my_company(db, current_user.id)
    return offer_service.list_my_offers(db, company.id)


@router.get("/tender/{tender_call_id}", response_model=List[OfferRead])
def get_offers_by_tender(tender_call_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION])
    return offer_service.list_offers_by_tender(db, tender_call_id)


@router.get("/admin", response_model=List[OfferRead])
def get_all_offers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION])
    return offer_service.list_all_offers(db)


@router.get("/{offer_id}", response_model=OfferRead)
def get_offer(offer_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    offer = offer_service.get_offer(db, offer_id)
    if current_user.role.name == ENTREPRISE:
        company = company_service.get_my_company(db, current_user.id)
        if offer.company_id != company.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acces refuse")
        return offer
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION])
    return offer


@router.patch("/{offer_id}/status", response_model=OfferRead)
def update_status(
    offer_id: int,
    data: OfferStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION])
    offer = offer_service.update_offer_status(db, offer_id, data)
    log_action(db, current_user.id, "offer.status", "Offer", offer.id)
    return offer


@router.patch("/{offer_id}/award", response_model=PublicContractRead)
def award_offer(offer_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    public_contract = offer_service.award_offer(db, offer_id)
    log_action(db, current_user.id, "offer.award", "Offer", offer_id)
    return public_contract
