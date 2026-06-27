from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.offer import Offer
from ..models.offer_evaluation import OfferEvaluation
from ..models.tender_call import TenderCall
from ..schemas.offer_evaluation_schema import OfferEvaluationCreate, OfferEvaluationUpdate
from . import offer_scoring_service


def _ensure_tender_in_evaluation(db: Session, offer: Offer) -> None:
    tender = db.query(TenderCall).filter(TenderCall.id == offer.tender_call_id).first()
    if not tender or tender.statut != "evaluation":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'appel d'offres doit etre en phase d'evaluation",
        )


def _apply_evaluation_outcome(offer: Offer, recommendation: str) -> None:
    if recommendation == "favorable":
        offer.statut = "accepted"
    elif recommendation == "unfavorable":
        offer.statut = "rejected"
    else:
        offer.statut = "under_review"


def create_offer_evaluation(db: Session, data: OfferEvaluationCreate, evaluator_id: int) -> OfferEvaluation:
    offer = db.query(Offer).filter(Offer.id == data.offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre introuvable")
    if offer.statut == "draft":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cette offre n'a pas ete soumise")
    _ensure_tender_in_evaluation(db, offer)
    existing = (
        db.query(OfferEvaluation)
        .filter(OfferEvaluation.offer_id == data.offer_id, OfferEvaluation.evaluator_id == evaluator_id)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous avez deja enregistre un avis pour cette offre",
        )
    offer_scoring_service.recalculate_tender_offer_scores(db, offer.tender_call_id)
    db.refresh(offer)
    evaluation = OfferEvaluation(
        offer_id=data.offer_id,
        evaluator_id=evaluator_id,
        technical_score=offer.score_technique or 0,
        financial_score=offer.score_financier or 0,
        comment=data.comment,
        recommendation=data.recommendation,
    )
    db.add(evaluation)
    _apply_evaluation_outcome(offer, data.recommendation)
    db.flush()
    offer_scoring_service.recalculate_tender_offer_scores(db, offer.tender_call_id)
    db.commit()
    db.refresh(evaluation)
    return evaluation


def list_evaluations_by_offer(db: Session, offer_id: int) -> list[OfferEvaluation]:
    return db.query(OfferEvaluation).filter(OfferEvaluation.offer_id == offer_id).order_by(OfferEvaluation.created_at.desc()).all()


def list_evaluations_by_tender(db: Session, tender_call_id: int) -> list[OfferEvaluation]:
    return (
        db.query(OfferEvaluation)
        .join(Offer, Offer.id == OfferEvaluation.offer_id)
        .filter(Offer.tender_call_id == tender_call_id)
        .order_by(OfferEvaluation.created_at.desc())
        .all()
    )


def get_offer_evaluation(db: Session, evaluation_id: int) -> OfferEvaluation:
    evaluation = db.query(OfferEvaluation).filter(OfferEvaluation.id == evaluation_id).first()
    if not evaluation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evaluation introuvable")
    return evaluation


def update_offer_evaluation(db: Session, evaluation_id: int, data: OfferEvaluationUpdate) -> OfferEvaluation:
    evaluation = get_offer_evaluation(db, evaluation_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(evaluation, field, value)
    offer = db.query(Offer).filter(Offer.id == evaluation.offer_id).first()
    if offer:
        if data.recommendation is not None:
            _apply_evaluation_outcome(offer, data.recommendation)
        db.flush()
        offer_scoring_service.recalculate_tender_offer_scores(db, offer.tender_call_id)
        db.refresh(offer)
        evaluation.technical_score = offer.score_technique or 0
        evaluation.financial_score = offer.score_financier or 0
    db.commit()
    db.refresh(evaluation)
    return evaluation


def delete_offer_evaluation(db: Session, evaluation_id: int) -> None:
    evaluation = get_offer_evaluation(db, evaluation_id)
    offer_id = evaluation.offer_id
    db.delete(evaluation)
    db.flush()
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if offer:
        offer_scoring_service.recalculate_tender_offer_scores(db, offer.tender_call_id)
    db.commit()
