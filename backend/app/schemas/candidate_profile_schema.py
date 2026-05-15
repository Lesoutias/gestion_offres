from pydantic import BaseModel, ConfigDict
from typing import Optional


class CandidateProfileBase(BaseModel):
    phone: Optional[str] = None
    address: Optional[str] = None
    education_level: Optional[str] = None
    domain: Optional[str] = None
    skills: Optional[str] = None  # JSON string or comma-separated
    experience_years: int = 0
    bio: Optional[str] = None


class CandidateProfileCreate(CandidateProfileBase):
    pass


class CandidateProfileUpdate(CandidateProfileBase):
    pass


class CandidateProfileRead(CandidateProfileBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)
