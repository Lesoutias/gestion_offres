from typing import Optional
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from .offer_document_schema import OfferDocumentType


class DaoDocumentBase(BaseModel):
    tender_call_id: int
    cahier_des_charges: Optional[str] = None
    criteres_selection: Optional[str] = None
    conditions_participation: Optional[str] = None
    pieces_exigees: Optional[str] = None
    required_document_types: list[OfferDocumentType] = Field(default_factory=list)
    document_url: Optional[str] = None


class DaoDocumentCreate(DaoDocumentBase):
    pass


class DaoDocumentUpdate(BaseModel):
    cahier_des_charges: Optional[str] = None
    criteres_selection: Optional[str] = None
    conditions_participation: Optional[str] = None
    pieces_exigees: Optional[str] = None
    required_document_types: Optional[list[OfferDocumentType]] = None
    document_url: Optional[str] = None


class DaoDocumentRead(DaoDocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DaoDocumentListRead(DaoDocumentRead):
    pass
