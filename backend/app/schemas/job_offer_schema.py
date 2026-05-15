from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

from .application_schema import ApplicationRecruiterRead


class JobOfferBase(BaseModel):
    title: str
    description: str
    location: Optional[str] = None
    company_id: int


class JobOfferCreate(JobOfferBase):
    pass


class JobOfferUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None


class JobOfferRead(JobOfferBase):
    id: int
    status: str  # pending, published, rejected, closed, expired
    created_at: datetime
    recruiter_id: int

    model_config = ConfigDict(from_attributes=True)


class JobOfferAdminRead(JobOfferRead):
    applications: Optional[List[ApplicationRecruiterRead]] = []
    recruiter_full_name: Optional[str] = None
    recruiter_email: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
