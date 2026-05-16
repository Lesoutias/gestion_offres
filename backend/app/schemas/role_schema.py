from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from .permission_schema import PermissionRead


class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None


class RoleCreate(RoleBase):
    pass


class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class RoleRead(RoleBase):
    id: int
    permissions: List[PermissionRead] = []

    model_config = ConfigDict(from_attributes=True)


class RolePermissionAssign(BaseModel):
    permission_ids: List[int]
