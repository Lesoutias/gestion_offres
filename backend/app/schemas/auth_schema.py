from pydantic import BaseModel, EmailStr
from typing import Optional

from .user_schema import UserRead


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role_name: Optional[str] = "candidate"


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserRead
