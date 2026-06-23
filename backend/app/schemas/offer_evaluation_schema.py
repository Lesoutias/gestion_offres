from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

EvaluationRecommendation = Literal["favorable", "unfavorable", "reserve"]


class OfferEvaluationCreate(BaseModel):
    offer_id: int
    comment: Optional[str] = None
    recommendation: EvaluationRecommendation
    evaluator_id: Optional[int] = None


class OfferEvaluationUpdate(BaseModel):
    technical_score: Optional[float] = Field(default=None, ge=0)
    financial_score: Optional[float] = Field(default=None, ge=0)
    comment: Optional[str] = None
    recommendation: Optional[EvaluationRecommendation] = None


class OfferEvaluationRead(OfferEvaluationCreate):
    id: int
    evaluator_id: int
    technical_score: float = Field(..., ge=0)
    financial_score: float = Field(..., ge=0)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OfferEvaluationListRead(OfferEvaluationRead):
    pass
