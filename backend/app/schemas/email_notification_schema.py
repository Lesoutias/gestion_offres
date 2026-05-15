from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from typing import Optional


class EmailNotificationBase(BaseModel):
    recipient_email: EmailStr
    subject: str
    message: str


class EmailNotificationCreate(EmailNotificationBase):
    application_id: Optional[int] = None
    sent_by_id: Optional[int] = None


class EmailNotificationRead(EmailNotificationBase):
    id: int
    application_id: Optional[int] = None
    sent_at: Optional[datetime] = None
    sent_by_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
