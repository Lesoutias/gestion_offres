from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

ExecutionStatus = Literal["not_started", "in_progress", "delayed", "completed", "cancelled"]


class ExecutionBase(BaseModel):
    public_contract_id: int
    avancement: float = Field(default=0.0, ge=0, le=100)
    date_debut: Optional[datetime] = None
    date_fin_prevue: Optional[datetime] = None
    date_fin_reelle: Optional[datetime] = None
    observations: Optional[str] = None


class ExecutionCreate(ExecutionBase):
    pass


class ExecutionUpdate(BaseModel):
    avancement: Optional[float] = Field(default=None, ge=0, le=100)
    date_debut: Optional[datetime] = None
    date_fin_prevue: Optional[datetime] = None
    date_fin_reelle: Optional[datetime] = None
    statut: Optional[ExecutionStatus] = None
    observations: Optional[str] = None


class ExecutionRead(ExecutionBase):
    id: int
    statut: ExecutionStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ExecutionListRead(ExecutionRead):
    pass
