from typing import List

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.offer_evaluation_schema import OfferEvaluationCreate, OfferEvaluationRead, OfferEvaluationUpdate
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION, require_roles
from ..services import offer_evaluation_service
from ..services.audit_log_service import log_action
from .auth_routes import get_current_user

router = APIRouter()


@router.post("", response_model=OfferEvaluationRead)
def create_evaluation(
    data: OfferEvaluationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION])
    evaluation = offer_evaluation_service.create_offer_evaluation(db, data, current_user.id)
    log_action(db, current_user.id, "offer_evaluation.create", "OfferEvaluation", evaluation.id)
    return evaluation


@router.get("/offer/{offer_id}", response_model=List[OfferEvaluationRead])
def list_by_offer(offer_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION])
    return offer_evaluation_service.list_evaluations_by_offer(db, offer_id)


@router.get("/tender/{tender_call_id}", response_model=List[OfferEvaluationRead])
def list_by_tender(tender_call_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION])
    return offer_evaluation_service.list_evaluations_by_tender(db, tender_call_id)


@router.put("/{evaluation_id}", response_model=OfferEvaluationRead)
def update_evaluation(
    evaluation_id: int,
    data: OfferEvaluationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION])
    evaluation = offer_evaluation_service.update_offer_evaluation(db, evaluation_id, data)
    log_action(db, current_user.id, "offer_evaluation.update", "OfferEvaluation", evaluation.id)
    return evaluation


@router.delete("/{evaluation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_evaluation(evaluation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE, COMMISSION_EVALUATION])
    offer_evaluation_service.delete_offer_evaluation(db, evaluation_id)
    log_action(db, current_user.id, "offer_evaluation.delete", "OfferEvaluation", evaluation_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
