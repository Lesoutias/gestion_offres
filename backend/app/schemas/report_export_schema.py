from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict

ReportType = Literal[
    "companies_ranking",
    "offers_summary",
    "commission_evaluations",
    "tenders_overview",
]


class ReportExportRead(BaseModel):
    id: int
    report_type: ReportType
    tender_call_id: Optional[int] = None
    file_name: str
    file_path: str
    generated_by_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
