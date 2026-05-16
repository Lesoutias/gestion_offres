from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

OfferDocumentType = Literal[
    "offre_technique",
    "offre_financiere",
    "rccm",
    "attestation_fiscale",
    "identification_nationale",
    "preuve_experience",
    "autre",
]


class OfferDocumentBase(BaseModel):
    offer_id: int
    document_type: OfferDocumentType
    file_url: str
    file_name: str
    file_mime_type: str


class OfferDocumentCreate(OfferDocumentBase):
    pass


class OfferDocumentUpdate(BaseModel):
    document_type: OfferDocumentType | None = None
    file_url: str | None = None
    file_name: str | None = None
    file_mime_type: str | None = None


class OfferDocumentRead(OfferDocumentBase):
    id: int
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OfferDocumentListRead(OfferDocumentRead):
    pass
