from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.offer import Offer
from ..models.offer_evaluation import OfferEvaluation
from ..models.tender_call import TenderCall
from ..schemas.offer_evaluation_schema import OfferEvaluationCreate, OfferEvaluationUpdate


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


def _recalculate_offer_scores(db: Session, offer_id: int) -> None:
    evaluations = db.query(OfferEvaluation).filter(OfferEvaluation.offer_id == offer_id).all()
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer or not evaluations:
        return
    offer.score_technique = sum(e.technical_score for e in evaluations) / len(evaluations)
    offer.score_financier = sum(e.financial_score for e in evaluations) / len(evaluations)
    offer.score_total = offer.score_technique + offer.score_financier
    latest = max(evaluations, key=lambda item: item.created_at)
    _apply_evaluation_outcome(offer, latest.recommendation)


def create_offer_evaluation(db: Session, data: OfferEvaluationCreate, evaluator_id: int) -> OfferEvaluation:
    offer = db.query(Offer).filter(Offer.id == data.offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offre introuvable")
    _ensure_tender_in_evaluation(db, offer)
    evaluation = OfferEvaluation(
        offer_id=data.offer_id,
        evaluator_id=evaluator_id,
        technical_score=data.technical_score,
        financial_score=data.financial_score,
        comment=data.comment,
        recommendation=data.recommendation,
    )
    db.add(evaluation)
    db.flush()
    _recalculate_offer_scores(db, data.offer_id)
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
    _recalculate_offer_scores(db, evaluation.offer_id)
    db.commit()
    db.refresh(evaluation)
    return evaluation


def delete_offer_evaluation(db: Session, evaluation_id: int) -> None:
    evaluation = get_offer_evaluation(db, evaluation_id)
    offer_id = evaluation.offer_id
    db.delete(evaluation)
    _recalculate_offer_scores(db, offer_id)
    db.commit()
