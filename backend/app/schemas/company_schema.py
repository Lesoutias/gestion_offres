from pydantic import BaseModel, ConfigDict
from typing import Optional


class CompanyBase(BaseModel):
    name: str
    description: Optional[str] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyRead(CompanyBase):
    id: int
    owner_id: Optional[int]

    model_config = ConfigDict(from_attributes=True)
