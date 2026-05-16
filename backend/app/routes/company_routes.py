from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.company_schema import CompanyCreate, CompanyRead, CompanyUpdate
from ..security.permissions import ADMIN, AUTORITE_PUBLIQUE, ENTREPRISE, require_roles
from ..services import company_service
from ..services.audit_log_service import log_action
from .auth_routes import get_current_user

router = APIRouter()


@router.get("/", response_model=List[CompanyRead])
def list_companies(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return company_service.list_companies(db)


@router.get("/me", response_model=CompanyRead)
def get_my_company(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ENTREPRISE])
    return company_service.get_my_company(db, current_user.id)


@router.get("/{company_id}", response_model=CompanyRead)
def get_company(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role.name == ENTREPRISE:
        company = company_service.get_company(db, company_id)
        if company.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acces refuse")
        return company
    require_roles(current_user, [ADMIN, AUTORITE_PUBLIQUE])
    return company_service.get_company(db, company_id)


@router.post("/", response_model=CompanyRead)
def create_company(data: CompanyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN, ENTREPRISE])
    if current_user.role.name == ENTREPRISE:
        data.owner_id = current_user.id
    company = company_service.create_company(db, data)
    log_action(db, current_user.id, "company.create", "Company", company.id)
    return company


@router.put("/{company_id}", response_model=CompanyRead)
def update_company(
    company_id: int,
    data: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    company = company_service.get_company(db, company_id)
    if current_user.role.name == ENTREPRISE and company.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acces refuse")
    if current_user.role.name != ENTREPRISE:
        require_roles(current_user, [ADMIN])
    updated = company_service.update_company(db, company_id, data)
    log_action(db, current_user.id, "company.update", "Company", updated.id)
    return updated


@router.patch("/{company_id}/verify", response_model=CompanyRead)
def verify_company(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_roles(current_user, [ADMIN])
    company = company_service.verify_company(db, company_id)
    log_action(db, current_user.id, "company.verify", "Company", company.id)
    return company
