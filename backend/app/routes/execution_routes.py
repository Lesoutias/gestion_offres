from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.execution_schema import ExecutionCreate, ExecutionRead, ExecutionUpdate
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, ENTREPRISE, require_roles
from ..services import company_service, execution_service
from ..services.audit_log_service import log_action
from .auth_routes import get_current_user

router = APIRouter()


@router.post("", response_model=ExecutionRead)
def create_execution(data: ExecutionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    execution = execution_service.create_execution(db, data)
    log_action(db, current_user.id, "execution.create", "Execution", execution.id)
    return execution


@router.get("", response_model=List[ExecutionRead])
def list_executions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return execution_service.list_executions(db)


@router.get("/me", response_model=List[ExecutionRead])
def get_my_executions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ENTREPRISE])
    company_id = company_service.get_my_company_id(db, current_user.id)
    if not company_id:
        return []
    return execution_service.list_company_executions(db, company_id)


@router.get("/public-contract/{public_contract_id}", response_model=ExecutionRead)
def get_execution_by_public_contract(
    public_contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return execution_service.get_execution_by_public_contract(db, public_contract_id)


@router.get("/{execution_id}", response_model=ExecutionRead)
def get_execution(execution_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return execution_service.get_execution(db, execution_id)


@router.put("/{execution_id}", response_model=ExecutionRead)
def update_execution(
    execution_id: int,
    data: ExecutionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    execution = execution_service.update_execution(db, execution_id, data)
    log_action(db, current_user.id, "execution.update", "Execution", execution.id)
    return execution


@router.patch("/{execution_id}/start", response_model=ExecutionRead)
def start_execution(execution_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    execution = execution_service.start_execution(db, execution_id)
    log_action(db, current_user.id, "execution.start", "Execution", execution.id)
    return execution


@router.patch("/{execution_id}/complete", response_model=ExecutionRead)
def complete_execution(execution_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    execution = execution_service.complete_execution(db, execution_id)
    log_action(db, current_user.id, "execution.complete", "Execution", execution.id)
    return execution


@router.patch("/{execution_id}/delay", response_model=ExecutionRead)
def delay_execution(execution_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    execution = execution_service.delay_execution(db, execution_id)
    log_action(db, current_user.id, "execution.delay", "Execution", execution.id)
    return execution
