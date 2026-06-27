from datetime import datetime
from pydantic import BaseModel, ConfigDict

OfferDocumentType = str


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


class SubmissionDocumentTypeRead(BaseModel):
    id: int
    code: str
    label: str
    description: str | None = None
    display_order: int

    model_config = ConfigDict(from_attributes=True)
