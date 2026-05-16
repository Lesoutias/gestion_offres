from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.execution import Execution
from ..models.public_contract import PublicContract
from ..schemas.execution_schema import ExecutionCreate, ExecutionUpdate


def create_execution(db: Session, data: ExecutionCreate) -> Execution:
    public_contract = db.query(PublicContract).filter(PublicContract.id == data.public_contract_id).first()
    if not public_contract:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Marche public introuvable")
    if public_contract.statut != "signed":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Le contrat doit etre signe")
    existing = db.query(Execution).filter(Execution.public_contract_id == data.public_contract_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Execution deja creee")
    execution = Execution(**data.model_dump())
    db.add(execution)
    db.commit()
    db.refresh(execution)
    return execution


def list_executions(db: Session) -> list[Execution]:
    return db.query(Execution).order_by(Execution.created_at.desc()).all()


def list_company_executions(db: Session, company_id: int) -> list[Execution]:
    return (
        db.query(Execution)
        .join(PublicContract, Execution.public_contract_id == PublicContract.id)
        .filter(PublicContract.company_id == company_id)
        .order_by(Execution.created_at.desc())
        .all()
    )


def get_execution(db: Session, execution_id: int) -> Execution:
    execution = db.query(Execution).filter(Execution.id == execution_id).first()
    if not execution:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Execution introuvable")
    return execution


def get_execution_by_public_contract(db: Session, public_contract_id: int) -> Execution:
    execution = db.query(Execution).filter(Execution.public_contract_id == public_contract_id).first()
    if not execution:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Execution introuvable")
    return execution


def update_execution(db: Session, execution_id: int, data: ExecutionUpdate) -> Execution:
    execution = get_execution(db, execution_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(execution, field, value)
    if execution.statut == "completed":
        execution.avancement = 100
    db.commit()
    db.refresh(execution)
    return execution


def start_execution(db: Session, execution_id: int) -> Execution:
    execution = get_execution(db, execution_id)
    if execution.public_contract.statut != "signed":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Contrat non signe")
    execution.statut = "in_progress"
    execution.date_debut = execution.date_debut or datetime.now(timezone.utc)
    execution.public_contract.statut = "in_execution"
    db.commit()
    db.refresh(execution)
    return execution


def complete_execution(db: Session, execution_id: int) -> Execution:
    execution = get_execution(db, execution_id)
    execution.statut = "completed"
    execution.avancement = 100
    execution.date_fin_reelle = datetime.now(timezone.utc)
    execution.public_contract.statut = "completed"
    db.commit()
    db.refresh(execution)
    return execution


def delay_execution(db: Session, execution_id: int) -> Execution:
    execution = get_execution(db, execution_id)
    if execution.statut == "completed":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Execution deja terminee")
    execution.statut = "delayed"
    db.commit()
    db.refresh(execution)
    return execution
