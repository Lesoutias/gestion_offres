from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.contract import Contract
from ..models.execution import Execution
from ..models.public_contract import PublicContract
from ..schemas.contract_schema import ContractCreate, ContractUpdate


def create_contract(db: Session, data: ContractCreate) -> Contract:
    public_contract = db.query(PublicContract).filter(PublicContract.id == data.public_contract_id).first()
    if not public_contract:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Marche public introuvable")
    if public_contract.statut not in ["awarded", "contract_pending"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Marche non eligible au contrat")
    existing = db.query(Contract).filter(Contract.public_contract_id == data.public_contract_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Contrat deja cree")
    contract = Contract(**data.model_dump())
    public_contract.statut = "contract_pending"
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract


def get_contract(db: Session, contract_id: int) -> Contract:
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contrat introuvable")
    return contract


def get_contract_by_public_contract(db: Session, public_contract_id: int) -> Contract:
    contract = db.query(Contract).filter(Contract.public_contract_id == public_contract_id).first()
    if not contract:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contrat introuvable")
    return contract


def update_contract(db: Session, contract_id: int, data: ContractUpdate) -> Contract:
    contract = get_contract(db, contract_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(contract, field, value)
    db.commit()
    db.refresh(contract)
    return contract


def attach_contract_file(db: Session, contract_id: int, file_url: str) -> Contract:
    contract = get_contract(db, contract_id)
    contract.contract_file_url = file_url
    db.commit()
    db.refresh(contract)
    return contract


def sign_contract(db: Session, contract_id: int) -> Contract:
    contract = get_contract(db, contract_id)
    if contract.statut != "draft":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Contrat non signable")
    public_contract = contract.public_contract
    if public_contract.statut not in ["awarded", "contract_pending"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Marche non signable")
    contract.statut = "signed"
    contract.date_signature = datetime.now(timezone.utc)
    public_contract.statut = "signed"
    existing_execution = db.query(Execution).filter(Execution.public_contract_id == public_contract.id).first()
    if not existing_execution:
        db.add(Execution(public_contract_id=public_contract.id, statut="not_started", avancement=0))
    db.commit()
    db.refresh(contract)
    return contract
