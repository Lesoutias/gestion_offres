from typing import List

from fastapi import APIRouter, Depends, File, Response, UploadFile, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.execution_report_schema import ExecutionReportCreate, ExecutionReportRead, ExecutionReportUpdate
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, require_roles
from ..services import execution_report_service
from ..services.audit_log_service import log_action
from ..services.file_upload_service import FileUploadService
from .auth_routes import get_current_user

router = APIRouter()


@router.post("/", response_model=ExecutionReportRead)
def create_execution_report(
    data: ExecutionReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    report = execution_report_service.create_execution_report(db, data, current_user.id)
    log_action(db, current_user.id, "execution_report.create", "ExecutionReport", report.id)
    return report


@router.get("/execution/{execution_id}", response_model=List[ExecutionReportRead])
def list_reports_by_execution(execution_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return execution_report_service.list_reports_by_execution(db, execution_id)


@router.get("/{report_id}", response_model=ExecutionReportRead)
def get_execution_report(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return execution_report_service.get_execution_report(db, report_id)


@router.put("/{report_id}", response_model=ExecutionReportRead)
def update_execution_report(
    report_id: int,
    data: ExecutionReportUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    report = execution_report_service.update_execution_report(db, report_id, data)
    log_action(db, current_user.id, "execution_report.update", "ExecutionReport", report.id)
    return report


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_execution_report(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    execution_report_service.delete_execution_report(db, report_id)
    log_action(db, current_user.id, "execution_report.delete", "ExecutionReport", report_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{report_id}/upload-file", response_model=ExecutionReportRead)
async def upload_report_file(
    report_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    saved = await FileUploadService.save_upload(file, "execution_reports")
    report = execution_report_service.attach_report_file(db, report_id, saved["file_url"])
    log_action(db, current_user.id, "execution_report.upload", "ExecutionReport", report.id)
    return report
