from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class JobOfferReviewBase(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None
    is_report: bool = False


class JobOfferReviewCreate(JobOfferReviewBase):
    job_offer_id: int
    candidate_id: int


class JobOfferReviewUpdate(JobOfferReviewBase):
    pass


class JobOfferReviewRead(JobOfferReviewBase):
    id: int
    job_offer_id: int
    candidate_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
