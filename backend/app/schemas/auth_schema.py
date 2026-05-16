from typing import Optional

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    user_id: Optional[int] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class CompanyRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    company_name: str
    company_description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    rccm_number: Optional[str] = None
    tax_number: Optional[str] = None
    sector: Optional[str] = None


class RegisterRequest(CompanyRegisterRequest):
    pass


class AdminUserCreateRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role_name: Optional[str] = "autorite_publique"
