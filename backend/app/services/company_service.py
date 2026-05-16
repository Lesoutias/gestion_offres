from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.company import Company
from ..schemas.company_schema import CompanyCreate, CompanyUpdate


def list_companies(db: Session) -> list[Company]:
    return db.query(Company).order_by(Company.created_at.desc()).all()


def get_company(db: Session, company_id: int) -> Company:
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entreprise introuvable")
    return company


def get_my_company(db: Session, owner_id: int) -> Company:
    company = db.query(Company).filter(Company.owner_id == owner_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profil entreprise introuvable")
    return company


def create_company(db: Session, data: CompanyCreate) -> Company:
    company = Company(**data.model_dump())
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


def update_company(db: Session, company_id: int, data: CompanyUpdate) -> Company:
    company = get_company(db, company_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(company, field, value)
    db.commit()
    db.refresh(company)
    return company


def verify_company(db: Session, company_id: int) -> Company:
    company = get_company(db, company_id)
    company.is_verified = True
    db.commit()
    db.refresh(company)
    return company
