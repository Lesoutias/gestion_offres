from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str
    role_name: Optional[str] = "candidate"


class UserRead(UserBase):
    id: int
    is_active: bool
    role_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
