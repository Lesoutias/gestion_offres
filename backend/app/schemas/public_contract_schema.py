from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

PublicContractStatus = Literal[
    "awarded",
    "contract_pending",
    "contract_rejected",
    "signed",
    "in_execution",
    "completed",
    "cancelled",
]


class PublicContractBase(BaseModel):
    tender_call_id: int
    company_id: int
    offer_id: int
    authority_id: int
    montant: float = Field(..., ge=0)


class PublicContractCreate(PublicContractBase):
    pass


class PublicContractUpdate(BaseModel):
    montant: Optional[float] = Field(default=None, ge=0)
    statut: Optional[PublicContractStatus] = None


class PublicContractRead(PublicContractBase):
    id: int
    statut: PublicContractStatus
    date_attribution: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PublicContractListRead(PublicContractRead):
    pass
