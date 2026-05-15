from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class ApplicationDocumentBase(BaseModel):
    document_type: str  # cv, diploma, cover_letter, identity_card, certificate, other
    file_url: str
    file_name: str
    file_mime_type: Optional[str] = None


class ApplicationDocumentCreate(ApplicationDocumentBase):
    pass


class ApplicationDocumentRead(ApplicationDocumentBase):
    id: int
    application_id: int
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)
