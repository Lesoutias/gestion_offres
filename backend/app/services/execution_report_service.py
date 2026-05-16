from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.execution_report import ExecutionReport
from ..schemas.execution_report_schema import ExecutionReportCreate, ExecutionReportUpdate


def create_execution_report(db: Session, data: ExecutionReportCreate, created_by_id: int) -> ExecutionReport:
    report = ExecutionReport(
        execution_id=data.execution_id,
        title=data.title,
        description=data.description,
        progress_percentage=data.progress_percentage,
        report_file_url=data.report_file_url,
        created_by_id=created_by_id,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def list_reports_by_execution(db: Session, execution_id: int) -> list[ExecutionReport]:
    return (
        db.query(ExecutionReport)
        .filter(ExecutionReport.execution_id == execution_id)
        .order_by(ExecutionReport.created_at.desc())
        .all()
    )


def get_execution_report(db: Session, report_id: int) -> ExecutionReport:
    report = db.query(ExecutionReport).filter(ExecutionReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rapport introuvable")
    return report


def update_execution_report(db: Session, report_id: int, data: ExecutionReportUpdate) -> ExecutionReport:
    report = get_execution_report(db, report_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(report, field, value)
    db.commit()
    db.refresh(report)
    return report


def attach_report_file(db: Session, report_id: int, file_url: str) -> ExecutionReport:
    report = get_execution_report(db, report_id)
    report.report_file_url = file_url
    db.commit()
    db.refresh(report)
    return report


def delete_execution_report(db: Session, report_id: int) -> None:
    report = get_execution_report(db, report_id)
    db.delete(report)
    db.commit()
