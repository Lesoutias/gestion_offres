from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

EvaluationRecommendation = Literal["favorable", "unfavorable", "reserve"]


class OfferEvaluationBase(BaseModel):
    offer_id: int
    technical_score: float = Field(..., ge=0)
    financial_score: float = Field(..., ge=0)
    comment: Optional[str] = None
    recommendation: EvaluationRecommendation


class OfferEvaluationCreate(OfferEvaluationBase):
    evaluator_id: Optional[int] = None


class OfferEvaluationUpdate(BaseModel):
    technical_score: Optional[float] = Field(default=None, ge=0)
    financial_score: Optional[float] = Field(default=None, ge=0)
    comment: Optional[str] = None
    recommendation: Optional[EvaluationRecommendation] = None


class OfferEvaluationRead(OfferEvaluationBase):
    id: int
    evaluator_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OfferEvaluationListRead(OfferEvaluationRead):
    pass
