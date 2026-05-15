from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class ApplicationBase(BaseModel):
    job_offer_id: int
    cover_letter: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationRead(ApplicationBase):
    id: int
    candidate_id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ApplicationRecruiterRead(ApplicationRead):
    candidate_full_name: Optional[str] = None
    candidate_email: Optional[str] = None
    job_offer_title: Optional[str] = None
    job_offer_location: Optional[str] = None


class ApplicationUpdate(BaseModel):
    status: str
    cover_letter: Optional[str] = None


class ApplicationDetailRead(ApplicationRead):
    candidate_full_name: Optional[str] = None
    candidate_email: Optional[str] = None
    job_offer_title: Optional[str] = None
    job_offer_location: Optional[str] = None
    documents: Optional[List] = []

    model_config = ConfigDict(from_attributes=True)
