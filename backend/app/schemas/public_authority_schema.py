from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime


class PublicAuthorityBase(BaseModel):
    name: str
    description: Optional[str] = None
    budget: Optional[float] = 0.0
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


class PublicAuthorityCreate(PublicAuthorityBase):
    user_id: int


class PublicAuthorityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    budget: Optional[float] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


class PublicAuthorityRead(PublicAuthorityBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PublicAuthorityListRead(PublicAuthorityRead):
    pass


class DefineNeedRequest(BaseModel):
    objet: str
    description: Optional[str] = None


class PlanTenderRequest(BaseModel):
    reference: str
    objet: str
    date_limite: datetime
    budget_previsionnel: Optional[float] = None
    type_marche: Optional[str] = None
    lieu_execution: Optional[str] = None
    description: Optional[str] = None
