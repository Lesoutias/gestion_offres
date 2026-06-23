from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

OfferStatus = Literal["submitted", "under_review", "accepted", "rejected", "awarded"]
Currency = Literal["CDF", "USD"]


class OfferBase(BaseModel):
    tender_call_id: int
    company_id: int
    montant: float = Field(..., ge=0)
    devise: Currency = "USD"
    delai_execution: Optional[str] = None
    proposition_technique: Optional[str] = None
    proposition_financiere: Optional[str] = None


class OfferCreate(OfferBase):
    pass


class OfferUpdate(BaseModel):
    montant: Optional[float] = Field(default=None, ge=0)
    devise: Optional[Currency] = None
    delai_execution: Optional[str] = None
    proposition_technique: Optional[str] = None
    proposition_financiere: Optional[str] = None
    statut: Optional[OfferStatus] = None
    score_technique: Optional[float] = Field(default=None, ge=0)
    score_financier: Optional[float] = Field(default=None, ge=0)
    score_total: Optional[float] = Field(default=None, ge=0)


class OfferStatusUpdate(BaseModel):
    statut: OfferStatus


class OfferRead(OfferBase):
    id: int
    submitted_by_id: int
    statut: OfferStatus
    score_technique: Optional[float] = None
    score_financier: Optional[float] = None
    score_total: Optional[float] = None
    date_soumission: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OfferListRead(OfferRead):
    pass


class OfferAdminRead(OfferRead):
    pass


class OfferDocumentValidationRead(BaseModel):
    valid: bool
    required: list[str]
    uploaded: list[str]
    missing: list[str]
