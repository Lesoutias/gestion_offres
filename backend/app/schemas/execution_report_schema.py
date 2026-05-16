from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ExecutionReportBase(BaseModel):
    execution_id: int
    title: str
    description: Optional[str] = None
    progress_percentage: float = Field(..., ge=0, le=100)
    report_file_url: Optional[str] = None


class ExecutionReportCreate(ExecutionReportBase):
    created_by_id: Optional[int] = None


class ExecutionReportUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    progress_percentage: Optional[float] = Field(default=None, ge=0, le=100)
    report_file_url: Optional[str] = None


class ExecutionReportRead(ExecutionReportBase):
    id: int
    created_by_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ExecutionReportListRead(ExecutionReportRead):
    pass
