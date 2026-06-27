from sqlalchemy.orm import Session

from ..models.offer import Offer
from ..models.offer_evaluation import OfferEvaluation
from ..services import offer_service


COMMISSION_RECOMMENDATION_SCORES = {
    "favorable": 100.0,
    "reserve": 50.0,
    "unfavorable": 0.0,
}


def compute_technical_score(db: Session, offer_id: int) -> float:
    offer = offer_service.get_offer(db, offer_id)
    required = offer_service.get_dao_required_document_types(db, offer.tender_call_id)
    if not required:
        return 100.0
    uploaded = {document.document_type for document in offer.documents}
    matched = sum(1 for document_type in required if document_type in uploaded)
    return round((matched / len(required)) * 100, 2)


def compute_financial_scores_for_tender(db: Session, tender_call_id: int) -> dict[int, float]:
    offers = (
        db.query(Offer)
        .filter(Offer.tender_call_id == tender_call_id, Offer.statut != "draft")
        .all()
    )
    scores: dict[int, float] = {}
    by_devise: dict[str, list[Offer]] = {}
    for offer in offers:
        by_devise.setdefault(offer.devise, []).append(offer)

    for devise_offers in by_devise.values():
        if not devise_offers:
            continue
        positive = [offer for offer in devise_offers if offer.montant > 0]
        if not positive:
            for offer in devise_offers:
                scores[offer.id] = 0.0
            continue
        min_amount = min(offer.montant for offer in positive)
        for offer in devise_offers:
            if len(devise_offers) == 1:
                scores[offer.id] = 100.0
            elif offer.montant <= 0:
                scores[offer.id] = 0.0
            else:
                scores[offer.id] = round((min_amount / offer.montant) * 100, 2)
    return scores


def compute_commission_score(db: Session, offer_id: int) -> float | None:
    recommendations = [
        row[0]
        for row in db.query(OfferEvaluation.recommendation)
        .filter(OfferEvaluation.offer_id == offer_id)
        .all()
    ]
    if not recommendations:
        return None
    scores = [COMMISSION_RECOMMENDATION_SCORES[value] for value in recommendations]
    return round(sum(scores) / len(scores), 2)


def recalculate_tender_offer_scores(db: Session, tender_call_id: int) -> None:
    financial_scores = compute_financial_scores_for_tender(db, tender_call_id)
    offers = db.query(Offer).filter(Offer.tender_call_id == tender_call_id, Offer.statut != "draft").all()
    for offer in offers:
        offer.score_technique = compute_technical_score(db, offer.id)
        offer.score_financier = financial_scores.get(offer.id, 0.0)
        offer.score_commission = compute_commission_score(db, offer.id)
        offer.score_total = round(
            (offer.score_technique or 0) * 0.40
            + (offer.score_financier or 0) * 0.40
            + (offer.score_commission or 0) * 0.20,
            2,
        )
    db.flush()
