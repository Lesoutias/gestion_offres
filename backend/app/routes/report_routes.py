from typing import List

from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.report_export_schema import ReportExportRead
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, require_roles
from ..services import report_service
from ..services.audit_log_service import log_action
from .auth_routes import get_current_user

router = APIRouter()


def _pdf_response(content: bytes, filename: str) -> Response:
    return Response(
        content=content,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/tender/{tender_call_id}/companies-ranking/pdf")
def download_companies_ranking_pdf(
    tender_call_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    content, filename, _export = report_service.generate_companies_ranking_pdf(db, tender_call_id, current_user.id)
    log_action(db, current_user.id, "report.companies_ranking", "TenderCall", tender_call_id)
    return _pdf_response(content, filename)


@router.get("/tender/{tender_call_id}/offers-summary/pdf")
def download_offers_summary_pdf(
    tender_call_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    content, filename, _export = report_service.generate_offers_summary_pdf(db, tender_call_id, current_user.id)
    log_action(db, current_user.id, "report.offers_summary", "TenderCall", tender_call_id)
    return _pdf_response(content, filename)


@router.get("/tender/{tender_call_id}/commission-evaluations/pdf")
def download_commission_evaluations_pdf(
    tender_call_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    content, filename, _export = report_service.generate_commission_evaluations_pdf(db, tender_call_id, current_user.id)
    log_action(db, current_user.id, "report.commission_evaluations", "TenderCall", tender_call_id)
    return _pdf_response(content, filename)


@router.get("/tenders-overview/pdf")
def download_tenders_overview_pdf(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    content, filename, _export = report_service.generate_tenders_overview_pdf(db, current_user.id)
    log_action(db, current_user.id, "report.tenders_overview", "ReportExport", _export.id)
    return _pdf_response(content, filename)


@router.get("/archives", response_model=List[ReportExportRead])
def list_report_archives(
    tender_call_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return report_service.list_report_archives(db, tender_call_id)


@router.get("/archives/{export_id}/download")
def download_report_archive(
    export_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    export = report_service.get_report_archive(db, export_id)
    content = report_service.read_report_archive_bytes(export)
    log_action(db, current_user.id, "report.archive_download", "ReportExport", export_id)
    return _pdf_response(content, export.file_name)
