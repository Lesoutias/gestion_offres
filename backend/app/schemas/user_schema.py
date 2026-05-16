from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from .role_schema import RoleRead


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str
    role_name: str = "entreprise"


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    role_name: Optional[str] = None


class UserRead(UserBase):
    id: int
    is_active: bool
    role_id: Optional[int] = None
    role_name: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    role: Optional[RoleRead] = None

    model_config = ConfigDict(from_attributes=True)


class UserAdminRead(UserRead):
    permissions: Optional[List[str]] = None


class UserListRead(UserRead):
    pass
