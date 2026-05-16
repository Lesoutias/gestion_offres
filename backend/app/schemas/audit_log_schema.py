from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AuditLogBase(BaseModel):
    user_id: Optional[int] = None
    action: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    description: Optional[str] = None


class AuditLogCreate(AuditLogBase):
    pass


class AuditLogRead(AuditLogBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuditLogListRead(AuditLogRead):
    pass
