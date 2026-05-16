from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict

ContractStatus = Literal["draft", "signed", "cancelled"]


class ContractBase(BaseModel):
    public_contract_id: int
    reference: str
    garanties: Optional[str] = None
    obligations: Optional[str] = None
    contract_file_url: Optional[str] = None


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    reference: Optional[str] = None
    date_signature: Optional[datetime] = None
    garanties: Optional[str] = None
    obligations: Optional[str] = None
    contract_file_url: Optional[str] = None
    statut: Optional[ContractStatus] = None


class ContractRead(ContractBase):
    id: int
    date_signature: Optional[datetime] = None
    statut: ContractStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ContractListRead(ContractRead):
    pass
