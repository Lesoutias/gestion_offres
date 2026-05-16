from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.public_contract import PublicContract
from ..schemas.public_contract_schema import PublicContractCreate, PublicContractUpdate


def create_public_contract(db: Session, data: PublicContractCreate) -> PublicContract:
    existing = db.query(PublicContract).filter(PublicContract.offer_id == data.offer_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Marche deja cree pour cette offre")
    contract = PublicContract(**data.model_dump())
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract


def list_public_contracts(db: Session) -> list[PublicContract]:
    return db.query(PublicContract).order_by(PublicContract.created_at.desc()).all()


def list_company_public_contracts(db: Session, company_id: int) -> list[PublicContract]:
    return (
        db.query(PublicContract)
        .filter(PublicContract.company_id == company_id)
        .order_by(PublicContract.created_at.desc())
        .all()
    )


def get_public_contract(db: Session, public_contract_id: int) -> PublicContract:
    public_contract = db.query(PublicContract).filter(PublicContract.id == public_contract_id).first()
    if not public_contract:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Marche public introuvable")
    return public_contract


def update_public_contract(db: Session, public_contract_id: int, data: PublicContractUpdate) -> PublicContract:
    public_contract = get_public_contract(db, public_contract_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(public_contract, field, value)
    db.commit()
    db.refresh(public_contract)
    return public_contract


def sign_public_contract(db: Session, public_contract_id: int) -> PublicContract:
    public_contract = get_public_contract(db, public_contract_id)
    if public_contract.statut not in ["awarded", "contract_pending"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Marche non signable")
    public_contract.statut = "signed"
    db.commit()
    db.refresh(public_contract)
    return public_contract


def cancel_public_contract(db: Session, public_contract_id: int) -> PublicContract:
    public_contract = get_public_contract(db, public_contract_id)
    if public_contract.statut in ["completed"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Marche termine")
    public_contract.statut = "cancelled"
    db.commit()
    db.refresh(public_contract)
    return public_contract
