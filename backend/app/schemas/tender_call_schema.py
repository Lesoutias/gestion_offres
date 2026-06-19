from typing import Literal, Optional
from datetime import datetime

from pydantic import BaseModel, ConfigDict

TenderStatus = Literal["draft", "published", "closed", "evaluation", "awarded", "cancelled"]
Currency = Literal["CDF", "USD"]


class TenderCallBase(BaseModel):
    reference: str
    objet: str
    description: Optional[str] = None
    date_limite: datetime
    budget_previsionnel: Optional[float] = None
    budget_devise: Currency = "USD"
    type_marche: Optional[str] = None
    lieu_execution: Optional[str] = None


class TenderCallCreate(BaseModel):
    reference: Optional[str] = None
    objet: str
    description: Optional[str] = None
    date_limite: datetime
    budget_previsionnel: Optional[float] = None
    budget_devise: Currency = "USD"
    type_marche: Optional[str] = None
    lieu_execution: Optional[str] = None
    authority_id: int
    published_by_id: Optional[int] = None


class TenderCallUpdate(BaseModel):
    reference: Optional[str] = None
    objet: Optional[str] = None
    description: Optional[str] = None
    date_limite: Optional[datetime] = None
    budget_previsionnel: Optional[float] = None
    budget_devise: Optional[Currency] = None
    type_marche: Optional[str] = None
    lieu_execution: Optional[str] = None
    statut: Optional[TenderStatus] = None


class TenderCallRead(TenderCallBase):
    id: int
    reference: str
    date_publication: Optional[datetime] = None
    statut: TenderStatus
    authority_id: int
    published_by_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TenderCallAdminRead(TenderCallRead):
    pass


class TenderCallListRead(TenderCallRead):
    pass
