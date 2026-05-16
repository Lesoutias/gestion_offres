from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime


class CompanyBase(BaseModel):
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    rccm_number: Optional[str] = None
    tax_number: Optional[str] = None
    sector: Optional[str] = None


class CompanyCreate(CompanyBase):
    owner_id: int


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    rccm_number: Optional[str] = None
    tax_number: Optional[str] = None
    sector: Optional[str] = None


class CompanyRead(CompanyBase):
    id: int
    owner_id: Optional[int] = None
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CompanyListRead(CompanyRead):
    pass


class CompanyAdminRead(CompanyRead):
    pass
